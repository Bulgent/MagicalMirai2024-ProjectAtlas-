import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, GeoJSON, Circle, Tooltip, useMap, Marker } from 'react-leaflet';
import { LeafletMouseEvent, marker, Map, point, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/App.css';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import { computePath } from '../services/ComputePath.ts'
import { checkArchType, formatKashi, calculateVector } from '../utils/utils.ts'
import { seasonType, weatherType, timeType, pointToLayer, mapStyle, polygonStyle, mapStylePathWay } from '../utils/MapStyle.ts'
import { svgNote, svgAlien, svgUnicorn } from '../assets/marker/markerSVG.ts'

// 地図データの導入
import roads from '../assets/jsons/map_data/roads-kai.json'
import points from '../assets/jsons/map_data/points.json'
import areas from '../assets/jsons/map_data/areas.json'
import weather from '../assets/jsons/map_data/polygons.json'

// songDataの導入
import songData from '../utils/Song.ts';

import { PointProperties, lyricProperties, historyProperties } from '../types/types';
import { time } from 'console';

type noteTooltip = {
  fwdLength: number; // 前方の距離
  crtLength: number; // 現在の距離
  crtPosStart: [lat: number, lng: number]; // 現在の座標始まり
  crtPosEnd: [lat: number, lng: number]; // 現在の座標終わり
};

export const MapComponent = (props: any) => {
  // Mapのための定数
  const mapCenter: [number, number] = [34.6937, 135.5021];
  const mapSpeed: number = 0.0001;
  const mapZoom: number = 17; // Mapのzoomについて1が一番ズームアウト

  // React Hooks
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([]);
  const [timer, setTimer] = useState(0);
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const [pathwayFeature, setPathwayFeature] = useState<any[]>([]);
  const layerRef = useRef(null);
  const [songKashi, setKashi] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 });
  const [isInitMap, setIsInitMap] = useState<Boolean>(true);
  // const [season, setSeason] = useState<seasonType>(seasonType.SUMMER);
  // const [time, setTime] = useState<timeType>(timeType.MORNING);
  // const [weather, setWeather] = useState<weatherType>(weatherType.SUNNY);

  const [noteCoordinates, setNoteCoordinates] = useState<{ note: string, lyric: string, lat: number, lng: number, start: number, end: number }[]>([]);

  // 初回だけ処理
  useEffect(() => {
    // console.log("init process", layerRef.current);
    const [features, nodes] = computePath();
    setRoutePositions(nodes);
    setPathwayFeature(features);
  }, []); // 空の依存配列を渡すことで、この効果はコンポーネントのマウント時にのみ実行されます。


  // 👽マーカーの表示(単語によって色を変える)👽 
  // TODO 歌詞の長さでの配置にする．
  const AddNotesToMap = () => {
    const map = useMap();
    useEffect(() => {
      if (props.songnum == -1 || props.songnum == null || !isInitMap) {
        return
      }

      // 歌詞の時間を取得
      let wordTemp = props.player.video.firstWord
      // 曲の始まりを追加
      let wordTime: { lyric: string, start: number, end: number }[] = [{
        lyric: "",
        start: 0,
        end: wordTemp.startTime
      }]
      while (wordTemp.next != null) {
        wordTime.push({
          lyric: wordTemp.text,
          start: wordTemp.startTime,
          end: wordTemp.endTime
        })
        wordTemp = wordTemp.next
      }
      // 最後の歌詞を追加
      wordTime.push({
        lyric: wordTemp.text,
        start: wordTemp.startTime,
        end: wordTemp.endTime
      })
      // 曲の終わりを追加
      wordTime.push({
        lyric: "",
        start: props.player.video.duration,
        end: props.player.video.duration
      })

      // 道路の長さを取得
      const [_, nodes] = computePath();
      let routeLength: noteTooltip[] = [];
      let routeEntireLength = 0.0;
      // それぞれの道路の長さを計算
      for (let i = 0; i < nodes.length - 1; i++) {
        let [lat, lon, distance] = calculateVector(nodes[i], nodes[i + 1]);
        // 配列に追加
        routeLength.push({
          fwdLength: routeEntireLength,
          crtLength: distance,
          crtPosStart: nodes[i],
          crtPosEnd: nodes[i + 1]
        });
        // 道路の長さを加算
        routeEntireLength += distance;
      }
      // console.log("曲長さ:", props.player.video.duration, "道長さ:", routeEntireLength)
      console.log(songData[props.songnum].note + "の数:", props.player.video.wordCount)
      // 単語数
      const wordCount = props.player.video.wordCount;
      const noteGain = routeEntireLength / props.player.video.duration;
      const noteLength = wordTime.map((word) => word.start * noteGain);
      let noteCd: { note: string; lyric: string; lat: number; lng: number; start: number, end: number }[] = [];
      // console.log("gain", noteGain)
      // console.log("noteLength", noteLength)

      // 歌詞の時間を元に🎵を配置
      noteLength.forEach((noteLen, index) => {
        // 歌詞の座標の含まれる道路を探す
        const noteIndex = routeLength.findIndex((route) => route.fwdLength <= noteLen && noteLen <= route.fwdLength + route.crtLength);
        // 歌詞の座標が含まれる道路の情報を取得
        const crtRoute = routeLength[noteIndex];
        // 歌詞の座標が含まれる道路の中での距離を計算
        const crtDistance = noteLen - crtRoute.fwdLength;
        const crtLat = crtRoute.crtPosStart[0] + (crtRoute.crtPosEnd[0] - crtRoute.crtPosStart[0]) * (crtDistance / crtRoute.crtLength);
        const crtLng = crtRoute.crtPosStart[1] + (crtRoute.crtPosEnd[1] - crtRoute.crtPosStart[1]) * (crtDistance / crtRoute.crtLength);
        let markerString = "🎵" // 表示する文字
        let markerSVG = "" // 表示するSVG
        switch (index) {
          case 0: // 最初
            markerString = "👽"
            markerSVG = svgAlien
            break;
          case wordCount + 1: // 最後
            markerString = "🦄"
            markerSVG = svgUnicorn
            break;
          default: // それ以外
            markerString = songData[props.songnum].note
            markerSVG = svgNote
            break;
        }
        noteCd.push({
          note: markerString,
          lyric: wordTime[index].lyric,
          lat: crtLat,
          lng: crtLng,
          start: wordTime[index].start,
          end: wordTime[index].end
        })

        // L.icon を使用してカスタムアイコンを設定
        const customIcon = divIcon({
          className: 'custom-icon', // カスタムクラス名
          html: markerSVG, // SVG アイコンの HTML
          iconSize: [50, 50], // アイコンのサイズ
          iconAnchor: [25, 50] // アイコンのアンカーポイント
        });

        // 歌詞の座標に🎵を表示
        const lyricMarker = marker([crtLat, crtLng], { icon: customIcon, opacity: 1 }).addTo(map);
        lyricMarker.bindTooltip(wordTime[index].lyric,
          { permanent: true, direction: 'bottom', interactive: true, className: "label-note" }).openTooltip();

        lyricMarker.on('click', function (e) {
          console.log("click")
          // ツールチップの文字取得
          const tooltip = e.target.getTooltip();
          const content = tooltip.getContent();
          console.log(content);
        });
      });



      // console.log(wordTime)
      console.log(noteCd)
      setNoteCoordinates(noteCd);
      setIsInitMap(false)
      return () => {
        console.log("unmount note")
      };
    }, [props.songnum, props.player?.video.wordTemp, isInitMap]);
    return <></>;
  };


  /**
   * Mapに対して、描画後に定期実行
   */
  const MapFunctionUpdate = () => {
    const map = useMap(); // MapContainerの中でしか取得できない
    addLyricTextToMap(map)
    return null
  }

  // 通る道についての描画（デバッグ用）
  const PathWay: React.FC = () => {
    if (pathwayFeature) {
      const geojson = {
        type: "FeatureCollection",
        features: pathwayFeature
      }
      return (
        <GeoJSON
          data={geojson as GeoJSON.GeoJsonObject}
          style={mapStylePathWay}
        />
      );
    } else {
      return null;
    }
  };

  const MoveMapByRoute = () => {
    const map = useMap();
    const EPSILON = 0.000000000000001; // 0除算回避

    useEffect(() => {
      // falseの場合動かない
      if (!props.isMoving) {
        return;
      }
      const timerId = setInterval(() => {

        // 移動するためのベクトルを計算（単位ベクトルなので速度は一定）
        const [vector_lat, vector_lon, distance] = calculateVector(
          routePositions[0],
          routePositions[1],
        );
        // 現在値がroute_positionsと同じ値になったらroute_positionsの先頭の要素を削除
        if (Math.abs(routePositions[1][0] - map.getCenter().lat) <= Math.abs(vector_lat / distance * mapSpeed) ||
          Math.abs(routePositions[1][1] - map.getCenter().lng) <= Math.abs(vector_lon / distance * mapSpeed)) {
          if (routePositions.length <= 2) {
            console.log("finish")
            clearInterval(timerId);
            return;
          } else {
            console.log("passed");
            setTimer(0)
            setRoutePositions(routePositions.slice(1));
          }
        } else {
          map.setView(
            [routePositions[0][0] + vector_lat / (distance + EPSILON) * timer * mapSpeed,
            routePositions[0][1] + vector_lon / (distance + EPSILON) * timer * mapSpeed],
            mapZoom
          );
        }
        setTimer((prevTimer) => prevTimer + 1);
      }, 16);
      // falseのreturnの跡にintervalの値をclearにリセット
      return () => {
        clearInterval(timerId);
      };
    }, [props.isMoving]);
    // コンポーネントとしての利用のために
    return null;
  }

  // 👽歌詞表示コンポーネント👽
  // コンポーネントとして実行しないと動かない?
  const addLyricTextToMap = (map: Map) => {
    // console.log(map.getSize(), map.getCenter(), map.getBounds())
    // 歌詞が変わったら実行 ボカロによって色を変える
    useEffect(() => {
      if (props.kashi.text == "" || props.kashi == songKashi) {
        return
      }
      // console.log(noteCoordinates)
      // TODO ナビゲーションの移動方向によってスライド方向を変える
      // TODO noteCoordinatesで歌詞の表示位置を変える
      setKashi(props.kashi)
      let printKashi: string = "<div class = 'tooltip-lyric'>";
      props.kashi.text.split('').forEach((char: string) => {
        printKashi += "<span class='";
        printKashi += formatKashi(char);
        printKashi += " " + songData[props.songnum].vocaloid.name + "'>" + char + "</span>";
      });
      printKashi += "</div>";
      console.log(printKashi);
      // 歌詞を表示する座標をランダムに決定
      const conversionFactor = [0.0, 0.0];
      // 座標の範囲を調整
      const adjustedNorth = map.getBounds().getNorth() - conversionFactor[0];
      const adjustedSouth = map.getBounds().getSouth() + conversionFactor[0];
      const adjustedEast = map.getBounds().getEast() - conversionFactor[1];
      const adjustedWest = map.getBounds().getWest() + conversionFactor[1];

      // 調整された範囲を使用してランダムな座標を生成
      const mapCoordinate: [number, number] = [
        Math.random() * (adjustedNorth - adjustedSouth) + adjustedSouth,
        Math.random() * (adjustedEast - adjustedWest) + adjustedWest
      ];
      // 地図の表示範囲内にランダムに歌詞配置
      const markertext = marker(mapCoordinate, { opacity: 0 });
      // 表示する歌詞
      markertext.bindTooltip(printKashi, { permanent: true, sticky: true, interactive: false, className: "label-kashi fade-text to_right", direction: "bottom" })
      // 地図に追加
      markertext.addTo(map);

      return () => {
        //markertext.remove();
      }
    }, [map, props.kashi, songKashi, props.songnum]);
    return null;
  };

  // 👽ポイントにマウスが乗ったときに呼び出される関数👽
  const onPointHover = (e: LeafletMouseEvent) => {
    console.log(e.sourceTarget.feature.properties.name, checkArchType(e.sourceTarget.feature.properties.type))
    // オフ会0人かどうか
    if (e.sourceTarget.feature.properties.name == "イオンシネマりんくう泉南") {
      console.log("オイイイッス！👽")
    }
    setHoverHistory((prev) => [...new Set([...prev, e.sourceTarget.feature])]);
    props.handOverHover(e.sourceTarget.feature)
  }

  // マップに表示されている文字を非表示にする
  // 初期表示にて上手く動かない songnumで解決ゾロリ
  useEffect(() => {
    if (layerRef.current) {
      const map = layerRef.current.getMaplibreMap();
      map.getStyle().layers.forEach(l => {
        if (l.type == "symbol") map.setLayoutProperty(l.id, "visibility", "none")
        // 海の色を赤くする
        // if (l.id == "water") map.setPaintProperty(l.id, "fill-color", "#ff0000")
        // 背景色を青くする
        // if (l.id == "background") map.setPaintProperty(l.id, "background-color", "#0000ff")
        // 敷地を青くする
        // if (l.id.includes("landuse")) map.setPaintProperty(l.id, "fill-color", "#0000ff")
        // if (l.paint.includes("linecolor")) map.setPaintProperty(l.id, "fill-color", "#0000ff")
      });

    }
  }, [props.songnum]);

  return (
    <>
      {/* centerは[緯度, 経度] */}
      {/* zoomは16くらいがgood */}

      <MapContainer className='mapcomponent' center={mapCenter} zoom={mapZoom} style={{ backgroundColor: '#f5f3f3' }} dragging={true} attributionControl={false}>

        <GeoJSON
          data={areas as GeoJSON.GeoJsonObject}
          style={mapStyle}
        />
        <GeoJSON
          data={roads as GeoJSON.GeoJsonObject}
          style={mapStyle}
        />
        <GeoJSON
          data={weather as GeoJSON.GeoJsonObject}
          style={polygonStyle(
            seasonType.SUMMER,
            timeType.NIGHT,
            weatherType.SUNNY
          )}
        />
        <GeoJSON
          data={points as GeoJSON.GeoJsonObject}
          pointToLayer={pointToLayer}
          onEachFeature={(_, layer) => {
            layer.on({
              mouseover: onPointHover, // ポイントにマウスが乗ったときに呼び出される関数
            });
          }}
        />
        <PathWay />
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/osm_bright.json" // https://docs.stadiamaps.com/map-styles/osm-bright/ より取得
          ref={layerRef}
        />
        <MoveMapByRoute />
        <AddNotesToMap />
        <MapFunctionUpdate />
      </MapContainer>
    </>
  );
};