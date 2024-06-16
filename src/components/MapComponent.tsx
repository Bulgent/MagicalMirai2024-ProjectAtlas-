import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapContainer, GeoJSON, Circle, Tooltip, useMap, Marker } from 'react-leaflet';
import { LeafletMouseEvent, marker, Map, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/App.css';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import { computePath } from '../services/ComputePath.ts'
import { KashiType, checkKashiType, ArchType, checkArchType, formatKashi, calculateVector, calculateDistance ,calculateEachRoadLengthRatio, getRationalPositonIndex} from '../utils/utils.ts'
import { pointToLayer, mapStyle, mapStylePathWay } from '../utils/MapStyle.ts'

// 地図データの導入
import roads from '../assets/jsons/map_data/roads-kai.json'
import points from '../assets/jsons/map_data/points.json'
import areas from '../assets/jsons/map_data/areas.json'

// カラーパレットの導入s
import songData from '../utils/Song.ts';


import { PointProperties, lyricProperties, historyProperties } from '../types/types';
import { dataUrlToString } from 'textalive-app-api';

type noteTooltip = {
  fwdLength: number; // 前方の距離
  crtLength: number; // 現在の距離
  crtPosStart: [lat: number, lng: number]; // 現在の座標始まり
  crtPosEnd: [lat: number, lng: number]; // 現在の座標終わり
};

export const MapComponent = (props: any) => {
  // Mapのための定数
  const mapCenter: [number, number] = [34.6937, 135.5021];
  const mapZoom: number = 17; // Mapのzoomについて1が一番ズームアウト
  const mapMoveRenderInterval_ms = 20;

  // React Hooks
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([]);
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const [pathwayFeature, setPathwayFeature] = useState<any[]>([]);
  const layerRef = useRef(null);
  const [songKashi, setKashi] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 });
  const [isInitMapPlayer, setIsInitMap] = useState<Boolean>(true);
  const lengthKmRef = useRef<number>(-1)
  const moveSpeedRef = useRef<number>(-1)
  const isInitPlayer = useRef(true)
  const isInitMap = useRef(true)
  const [noteCoordinates, setNoteCoordinates] = useState<[number, number][]>([]);
  const moveManageTimerRef = useRef(0)
  const vector_distance_sum = useRef(0)
  const km_distance_sum = useRef(0)
  const eachRoadLengthRatioRef = useRef<number[]>([])
  // このコンポーネントがレンダリングされた初回だけ処理
  useEffect(() => {
    const [features, nodes, length_km] = computePath();
    lengthKmRef.current = length_km
    eachRoadLengthRatioRef.current = calculateEachRoadLengthRatio(nodes)
    setRoutePositions(nodes);
    setPathwayFeature(features);
  }, []); 

  // Playerが作成された後に一度だけ処理
  useEffect(()=>{
    if (props.songnum == -1 || props.songnum == null || !isInitPlayer.current) {
      return
    }
    const [features, nodes, length_km] = computePath();
    lengthKmRef.current = length_km
    setRoutePositions(nodes);
    setPathwayFeature(features);
    let length_sum = 0
    vector_distance_sum.current = 0
    
    for (let i = 0; i < routePositions.length - 1; i++){
      length_sum = length_sum + calculateDistance(routePositions[i], routePositions[i+1])
      const [vector_lat, vector_lon, distance] = calculateVector(
        routePositions[i],
        routePositions[i+1],
      );
      vector_distance_sum.current = vector_distance_sum.current + distance
    }
    km_distance_sum.current = length_sum
    console.log(routePositions.length)
    // mapの移動速度を計算（km/s）
    moveSpeedRef.current = length_sum/props.player.video.duration
    isInitPlayer.current = false
  },[props.kashi, songKashi, props.songnum])

  /**
   * Mapから文字を消す処理
   */
  const RemoveMapTextFunction=() => {
    const map = useMap();
    useEffect(() => {
      if (!isInitMap){
        return
      }
      if (layerRef.current) {
        // 読み込みが2段階ある
        if(layerRef.current.getMaplibreMap().getStyle()===undefined){
          return
        }
        const map = layerRef.current.getMaplibreMap();
        map.getStyle().layers.forEach(l => {
          if (l.type == "symbol") map.setLayoutProperty(l.id, "visibility", "none")
        });
      isInitMap.current = false
      }
    }, [map]);
    return null;
  }

  // マーカーの表示(単語によって色を変える) 
  // TODO 歌詞の長さでの配置にする．
  const AddNotesToMap = () => {
    const map = useMap();
    useEffect(() => {
      if (props.songnum == -1 || props.songnum == null || !isInitMapPlayer) {
        return
      }
      // 道路の長さを取得
      const [_, nodes] = computePath();
      let routeLength = [];
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
      console.log(songData[props.songnum].note + "の数:", props.player.video.wordCount)
      const noteNum = props.player.video.wordCount; // 264 player.video.wordCount
      const noteInterval = routeEntireLength / noteNum;
      const noteLength = Array.from({ length: noteNum }, (_, i) => noteInterval * (i));
      const noteCd: [number, number][] = []

      // 道路の長さを元に歌詞を均等配置(なんかCopilotが勝手に入れてくれた)
      noteLength.forEach((noteLen) => {
        // 歌詞の座標の含まれる道路を探す
        const noteIndex = routeLength.findIndex((route) => route.fwdLength <= noteLen && noteLen <= route.fwdLength + route.crtLength);
        // 歌詞の座標が含まれる道路の情報を取得
        const crtRoute = routeLength[noteIndex];
        // 歌詞の座標が含まれる道路の中での距離を計算
        const crtDistance = noteLen - crtRoute.fwdLength;
        const crtLat = crtRoute.crtPosStart[0] + (crtRoute.crtPosEnd[0] - crtRoute.crtPosStart[0]) * (crtDistance / crtRoute.crtLength);
        const crtLng = crtRoute.crtPosStart[1] + (crtRoute.crtPosEnd[1] - crtRoute.crtPosStart[1]) * (crtDistance / crtRoute.crtLength);
        noteCd.push([crtLat, crtLng]);
        // 歌詞の座標に🎵を表示
        const lyricMarker = marker([crtLat, crtLng], { opacity: 0 }).addTo(map);
        lyricMarker.bindTooltip(songData[props.songnum].note,
          { permanent: true, direction: 'center', offset: L.point(-15, 0), interactive: false, className: "label-note" }).openTooltip();
      });
      setNoteCoordinates(noteCd);
      setIsInitMap(false)
      return () => {
        console.log("unmount note")
      };
    }, [props.songnum, props.player?.video.wordCount, isInitMapPlayer]);
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
          map.setView(
            [
              routePositions[startNodeIndex][0] * (1 - nodeResidue) + routePositions[startNodeIndex + 1][0] * nodeResidue,
              routePositions[startNodeIndex][1] * (1 - nodeResidue) + routePositions[startNodeIndex + 1][1] * nodeResidue,
            ],
            mapZoom
          );
  
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
  // コンポーネントとして実行しないと動かない?
  const addLyricTextToMap = (map:Map) => {
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
      // console.log(printKashi);
      // 歌詞を表示する座標をランダムに決定
      const conversionFactor = [0.0, 0.0];
      // 座標の範囲を調整
      const adjustedNorth = map.getBounds().getNorth() - conversionFactor[0];
      const adjustedSouth = map.getBounds().getSouth() + conversionFactor[0];
      const adjustedEast = map.getBounds().getEast() - conversionFactor[1]; // 地図の真ん中より左に配置
      const adjustedWest = map.getBounds().getWest() + conversionFactor[1];

      // 調整された範囲を使用してランダムな座標を生成
      const mapCoordinate: [number, number] = [
        Math.random() * (adjustedNorth - adjustedSouth) + adjustedSouth,
        Math.random() * (adjustedEast - adjustedWest) + adjustedWest
      ];
      // 地図の表示範囲内にランダムに歌詞配置
      const markertext = marker(mapCoordinate, { opacity: 0 });
      // 表示する歌詞
      markertext.bindTooltip(printKashi, { permanent: true, sticky: true, interactive: false, className: "label-kashi fade-text to_right", direction: "center" })
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
        <RemoveMapTextFunction />
      </MapContainer>
    </>
  );
};