import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { MapContainer, GeoJSON, useMap, Marker } from 'react-leaflet';
import L, { LeafletMouseEvent, marker, Map, point, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/App.css';
import '../styles/Lyrics.css';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import { computePath } from '../services/ComputePath.ts'
import { ComputeAhead } from '../services/ComputeAhead.ts'
import { seasonType, weatherType, timeType, mapStyle, polygonStyle, mapStylePathWay, showDetail } from '../utils/MapStyle.ts'
import {
  checkArchType, formatKashi, calculateDistance,
  calculateEachRoadLengthRatio, getRationalPositonIndex, changeColor, cssSlide
} from '../utils/utils.ts'
import "leaflet-rotatedmarker";
import { pngCar, svgNote, svgStart, svgGoal } from '../assets/marker/markerSVG.ts'
// 型データの導入
import { lyricProperties, historyProperties, noteProperties } from '../types/types';
// 地図データの導入
import trunk from '../assets/jsons/map_data/trunk.json'
import primary from '../assets/jsons/map_data/primary.json'
import secondary from '../assets/jsons/map_data/secondary.json'
import points from '../assets/jsons/map_data/points.json'
import sight from '../assets/jsons/map_data/sightseeing.json'
import areas from '../assets/jsons/map_data/area.json'
import sky from '../assets/jsons/map_data/polygons.json'

// songDataの導入
import songData from '../utils/Song.ts';

const carIcon = divIcon({ // 31x65px
  className: 'car-icon', // カスタムクラス名
  html: pngCar,  // ここに車のアイコンを挿入する
  iconSize: [31, 65], // アイコンのサイズ
  iconAnchor: [31 / 2, 65 / 2] // アイコンのアンカーポイント
});

// 車アイコンコンポーネント（回転対応）、変数共有のためファイル分離できてない
// HACK: ファイル分割したい
const RotatedMarker = forwardRef(({ children, ...props }, forwardRef) => {
  const markerRef = useRef(null);

  const { rotationAngle, rotationOrigin } = props;
  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.setRotationAngle(-rotationAngle);
      marker.setRotationOrigin(-rotationOrigin);
    }
  }, [rotationAngle, rotationOrigin]);

  return (
    <Marker
      ref={(ref) => {
        markerRef.current = ref;
        if (forwardRef) {
          forwardRef.current = ref;
        }
      }}
      icon={carIcon}
      {...props}
    >
      {children}
    </Marker>
  );
});

export const MapComponent = (props: any) => {
  /**
   * 定数
   */
  // Mapのための定数
  const startCoordinate: [number, number] = [34.503780572499515, 135.5574936226363];
  const endCoordinate: [number, number] = [34.6379271092576, 135.4196972135114];
  const mapZoom: number = 17; // Mapのzoomについて1が一番ズームアウト
  const roadJsonLst = [trunk, primary, secondary] // 表示する道路について
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1, -1])
  const [latOffset, lonOffset]: [number, number] = [-0.0006, 0] // Mapの中心位置を補正

  /**
   * React Hooks
   */
  // ホバーしたオブジェクトの格納
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([]);
  // 全ての道を表示（デバッグ用）
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  // 経路計算結果格納
  const [pathwayFeature, setPathwayFeature] = useState<any[]>([]);
  // TextAliveより得たデータ
  const [songKashi, setKashi] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 });
  // OpenStreetMapレイヤー
  const OSMlayerRef = useRef(null);
  // 初期化処理のフラグ
  const [isInitMapPlayer, setIsInitMap] = useState<Boolean>(true);
  const isInitMap = useRef(true)
  // 車アイコン
  const [carMapPosition, setCarMapPosition] = useState<[lat: number, lon: number]>([34, 135])
  const [heading, setHeading] = useState(180);
  // 音符配置
  const [noteCoordinates, setNoteCoordinates] = useState<{ note: string, lyric: string, lat: number, lng: number, start: number, end: number }[]>([]);
  // 移動処理
  const eachRoadLengthRatioRef = useRef<number[]>([])
  const degreeAnglesRef = useRef<number[]>([])
  const cumulativeAheadRatioRef = useRef<number[]>([])
  const kashicount = useRef<number>(0) // 触れた音符の数

  // 初回だけ処理
  // mapの初期位置、経路の計算
  useEffect(() => {
    const [features, nodes, mapCenterRet] = computePath(roadJsonLst, startCoordinate, endCoordinate);
    eachRoadLengthRatioRef.current = calculateEachRoadLengthRatio(nodes)
    const [aheads, degreeAngles, cumulativeAheadRatio] = ComputeAhead(nodes)
    degreeAnglesRef.current = degreeAngles
    cumulativeAheadRatioRef.current = cumulativeAheadRatio
    setRoutePositions(nodes);
    setPathwayFeature(features);
    setMapCenter([mapCenterRet[1] + latOffset, mapCenterRet[0] + lonOffset]);
    setCarMapPosition([mapCenterRet[1], mapCenterRet[0]])
    setHeading(0)
  }, []);

  /**
   * Mapから文字を消す処理  
   */
  // TODO: mapの初期スタイルも導入
  const RemoveMapTextFunction = () => {
    const map = useMap();
    useEffect(() => {
      if (!isInitMap.current) {
        return
      }
      // mapの初期中心座標の決定
      map.setView(mapCenter)
      if (OSMlayerRef.current) {
        // 読み込みが2段階ある
        if (OSMlayerRef.current.getMaplibreMap().getStyle() === undefined) {
          return
        }
        const map = OSMlayerRef.current.getMaplibreMap();
        // ここでスタイルを変更
        map.getStyle().layers.forEach(l => {
          if (l.type == "symbol") map.setLayoutProperty(l.id, "visibility", "none") // 文字を消す
          // 水の色を変更
          if (["waterway", "water"].includes(l.id) && l.type === "fill") {
            map.setPaintProperty(l.id, "fill-color", "#90dbee")
          }
          // 道路の色を変更
          if (l["source-layer"] === "transportation" && l.type === "line") {
            map.setPaintProperty(l.id, "line-color", "#8995a2")
          }
        });
        isInitMap.current = false
      }
    }, [map]);
    return null;
  }

  // 👽マーカーの表示(単語によって色を変える)👽 
  const AddNotesToMap = () => {
    const map = useMap();
    useEffect(() => {
      if (props.songnum == -1 || props.songnum == null || !isInitMapPlayer || routePositions.length === 0) {
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
      const nodes = routePositions;
      // const [_, nodes] = computePath();
      let routeLength: noteProperties[] = [];
      let routeEntireLength = 0.0;
      // それぞれの道路の長さを計算
      for (let i = 0; i < nodes.length - 1; i++) {
        let distance = calculateDistance(nodes[i], nodes[i + 1]);
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
            markerSVG = svgStart
            break;
          case wordCount + 1: // 最後
            markerString = "🦄"
            markerSVG = svgGoal
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
          iconAnchor: [25, 25] // アイコンのアンカーポイント
        });

        // 歌詞の座標に🎵を表示
        const lyricMarker = marker([crtLat, crtLng], { icon: customIcon, opacity: 1 }).addTo(map);
        lyricMarker.bindTooltip(wordTime[index].lyric, { permanent: true, direction: 'center', interactive: true, offset: point(30, 0), className: "label-note " + wordTime[index].start }).closeTooltip();

        lyricMarker.on('click', function (e) {
          console.log("click")
          // ツールチップの文字取得
          const tooltip = e.target.getTooltip();
          const content = tooltip.getContent();
          console.log(content);
        });
        map.on('move', function () {
          // ツールチップのDOM要素を取得
          const noteClass = lyricMarker.getTooltip()._container.className;
          // 正規表現を使用して数字を抽出
          const noteTime = noteClass.match(/\d+/g);
          // マーカーの時間が現在の再生時間よりも前である場合、マーカーを削除します。
          if (noteTime && noteTime[0] != 0 && noteTime[0] != props.player.video.duration && noteTime[0] <= props.player.timer?.position) {
            map.removeLayer(lyricMarker);
          }
        }, 250); // 250ミリ秒ごとに実行
      });
      setNoteCoordinates(noteCd);
      setIsInitMap(false)
      // 曲読み込み画面を隠す
      const overlay = document.querySelector("#overlay");
      if (overlay) {
        overlay.className = "inactive";
      }
      return () => {
        console.log("unmount note")
      };
    }, [props.songnum, props.player?.video.wordCount, isInitMapPlayer, routePositions]);

    return null;
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

  // 通る道の計算
  const MoveMapByRoute = () => {

    const map = useMap();
    const animationRef = useRef<number | null>(null);
    const loop = useCallback(
      () => {
        if (!props.isMoving) {
          return;
        }
        // 曲の全体における位置を確認
        const rationalPlayerPosition = props.player.timer.position / props.player.video.duration;

        if (rationalPlayerPosition < 1) {
          const [startNodeIndex, nodeResidue] = getRationalPositonIndex(rationalPlayerPosition, eachRoadLengthRatioRef.current);
          // 中心にセットする座標を計算
          const updatedLat = routePositions[startNodeIndex][0] * (1 - nodeResidue) + routePositions[startNodeIndex + 1][0] * nodeResidue;
          const updatedLon = routePositions[startNodeIndex][1] * (1 - nodeResidue) + routePositions[startNodeIndex + 1][1] * nodeResidue;
          map.setView([updatedLat + latOffset, updatedLon + lonOffset], mapZoom);

          // ここにアイコンの情報を入れる
          const [startAheadIndex, aheadResidue] = getRationalPositonIndex(rationalPlayerPosition, cumulativeAheadRatioRef.current);
          setCarMapPosition([updatedLat, updatedLon])
          setHeading(degreeAnglesRef.current[startAheadIndex])

          animationRef.current = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(animationRef.current!);
        }
      },
      [props.isMoving, props.player]
    );

    useEffect(() => {
      if (props.isMoving) {
        animationRef.current = requestAnimationFrame(loop);
      }

      return () => {
        cancelAnimationFrame(animationRef.current!);
      };
    }, [props.isMoving]);

    return null;
  };

  // 👽歌詞表示コンポーネント👽
  const addLyricTextToMap = (map: Map) => {
    // console.log(map.getSize(), map.getCenter(), map.getBounds())
    // 歌詞が変わったら実行 ボカロによって色を変える
    useEffect(() => {
      if (props.kashi.text == "" || props.kashi == songKashi) {
        return
      }
      kashicount.current += 1
      // console.log(noteCoordinates)
      // TODO ナビゲーションの移動方向によってスライド方向を変える
      // TODO noteCoordinatesで歌詞の表示位置を変える
      setKashi(props.kashi)
      const slideClass = 'slide' + kashicount.current
      let printKashi: string = "<div class = 'tooltip-lyric " + slideClass + "'>";
      props.kashi.text.split('').forEach((char: string) => {
        printKashi += "<span class='";
        printKashi += formatKashi(char);
        printKashi += " " + songData[props.songnum].vocaloid.name + "'>" + char + "</span>";
      });
      printKashi += "</div>";

      const mapCoordinate: [number, number] = [map.getCenter().lat - latOffset, map.getCenter().lng - lonOffset]
      const fadeInSlideRightKeyframes = cssSlide(kashicount.current);
      // <style>タグを生成して、生成した@keyframes定義を追加
      const styleTag = document.createElement('style');
      styleTag.innerHTML = fadeInSlideRightKeyframes;
      document.head.appendChild(styleTag);

      // 地図の表示範囲内にランダムに歌詞配置
      const markertext = marker(mapCoordinate, { opacity: 0 });
      // 表示する歌詞
      markertext.bindTooltip(printKashi, { permanent: true, sticky: true, interactive: false, className: "label-kashi", direction: "center" })
      // 地図に追加
      markertext.addTo(map);
      // アニメーション
      // document.querySelector('.' + slideClass).style.animation = 'parabolaSlideXY' + kashicount.current + ' 0.5s ease-in-out forwards';
      document.querySelector('.' + slideClass).style.animation = 'fadeInSlideXY' + kashicount.current + ' 0.5s ease forwards';

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
  const onSightHover = (e: LeafletMouseEvent) => {
    console.log(e.sourceTarget.feature.properties.event_place)
    setHoverHistory((prev) => [...new Set([...prev, e.sourceTarget.feature])]);
    props.handOverHover(e.sourceTarget.feature)
  }

  /**
   * 間奏中に色が変わるオーバーレイのレイヤ
   */
  const UpdatingOverlayLayer = () => {
    const overlayOpacity = 0.5
    // 曲を3区切りにした際のオーバーレイの色
    const style1 = polygonStyle(seasonType.SUMMER, timeType.MORNING, weatherType.SUNNY).fillColor;
    const style2 = polygonStyle(seasonType.SUMMER, timeType.NOON, weatherType.SUNNY).fillColor;
    const style3 = polygonStyle(seasonType.SUMMER, timeType.NIGHT, weatherType.SUNNY).fillColor;
    const updateLayer = (layer: any, hexColor: string, overlayOpacity: number) => {
      if (layer) {
        layer.clearLayers().addData(sky)
        layer.setStyle(
          {
            fillColor: hexColor,
            fillOpacity: overlayOpacity,
          }
        )
      }
    }
    const turnOverlayAnimation = () => {
      if (!props.isMoving) {
        return;
      }
      const rationalPlayerPosition = props.player.timer.position / props.player.video.duration;
      const turningStantPoint1To2 = songData[props.songnum].turningPoint1![0] / props.player.video.duration;
      const turningEndPoint1To2 = songData[props.songnum].turningPoint1![1] / props.player.video.duration;
      const turningStantPoint2To3 = songData[props.songnum].turningPoint2![0] / props.player.video.duration;
      const turningEndPoint2To3 = songData[props.songnum].turningPoint2![1] / props.player.video.duration;
      let progress;

      const layer = layerRef.current;
      if (rationalPlayerPosition < turningStantPoint1To2) {
        updateLayer(layer, style1, overlayOpacity)
      } else if (
        rationalPlayerPosition >= turningStantPoint1To2 &&
        rationalPlayerPosition < turningEndPoint1To2
      ) {
        progress = (rationalPlayerPosition - turningStantPoint1To2) / (turningEndPoint1To2 - turningStantPoint1To2);
        updateLayer(layer, changeColor(style1, style2, progress), overlayOpacity)
      } else if (
        rationalPlayerPosition >= turningEndPoint1To2 &&
        rationalPlayerPosition < turningStantPoint2To3
      ) {
        updateLayer(layer, style2, overlayOpacity)
      } else if (
        rationalPlayerPosition >= turningStantPoint2To3 &&
        rationalPlayerPosition < turningEndPoint2To3
      ) {
        progress = (rationalPlayerPosition - turningStantPoint2To3) / (turningEndPoint2To3 - turningStantPoint2To3);
        const layer = layerRef.current;
        updateLayer(layer, changeColor(style2, style3, progress), overlayOpacity)
      } else if (
        rationalPlayerPosition >= turningEndPoint2To3
      ) {
        updateLayer(layer, style3, overlayOpacity)
      }

      turnOverlayAnimationRef.current = requestAnimationFrame(turnOverlayAnimation);
    };

    const turnOverlayAnimationRef = useRef<number | null>(null);
    const layerRef = useRef<GeoJSON | null>(null);
    // オーバーレイ変更のためのトリガー
    useEffect(() => {
      if (props.isMoving) {
        turnOverlayAnimation();
      } else {
        cancelAnimationFrame(turnOverlayAnimationRef.current!);
      }
      return () => {
        cancelAnimationFrame(turnOverlayAnimationRef.current!);
      };
    }, [props.isMoving]);

    return (
      <GeoJSON
        data={sky as unknown as GeoJSON.GeoJsonObject}
        style={{
          fillColor: style1,
          fillOpacity: overlayOpacity,
        }}
        ref={layerRef}
      />
    )
  }

  return (
    <>
      {/* centerは[緯度, 経度] */}
      {/* zoomは16くらいがgood */}
      <MapContainer className='mapcomponent' center={[-1, -1]} zoom={mapZoom} style={{ backgroundColor: '#f5f3f3' }} dragging={true} attributionControl={false}>

        <GeoJSON
          data={areas as GeoJSON.GeoJsonObject}
          style={mapStyle}
        />
        <UpdatingOverlayLayer />
        {/* <GeoJSON
          data={points as GeoJSON.GeoJsonObject}
          pointToLayer={pointToLayer}
          onEachFeature={(_, layer) => {
            layer.on({
              mouseover: onPointHover, // ポイントにマウスが乗っかったときに呼び出される関数
            });
          }}
        /> */}
        <GeoJSON
          data={sight as GeoJSON.GeoJsonObject}
          pointToLayer={showDetail}
          onEachFeature={(_, layer) => {
            layer.on({
              mouseover: onSightHover, // ポイントにマウスが乗っかったときに呼び出される関数
            });
          }}
        />
        <PathWay />
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/stamen_terrain.json" // https://docs.stadiamaps.com/map-styles/osm-bright/ より取得
          ref={OSMlayerRef}
        />
        <MoveMapByRoute />
        <AddNotesToMap />
        <MapFunctionUpdate />
        <RemoveMapTextFunction />
        <RotatedMarker
          position={carMapPosition}
          rotationAngle={heading}
          rotationOrigin="center"
        >
        </RotatedMarker>
        {/* 曲の開始まで表示するレイヤ */}

      </MapContainer>
    </>
  );
};