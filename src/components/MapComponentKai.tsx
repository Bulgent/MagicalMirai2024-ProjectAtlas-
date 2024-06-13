import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, GeoJSON, Circle, Tooltip, useMap, Marker } from 'react-leaflet';
import { LeafletMouseEvent, marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/App.css';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import { computePath } from '../services/ComputePath.ts'
import { KashiType, checkKashiType, ArchType, checkArchType } from '../utils/utils.ts'
import { pointToLayer, mapStyle, mapStylePathWay } from '../utils/MapStyle.ts'

// 地図データの導入
import roads from '../assets/jsons/map_data/roads-kai.json'
import points from '../assets/jsons/map_data/points.json'
import areas from '../assets/jsons/map_data/areas.json'

// カラーパレットの導入
import songData from '../utils/Song.ts';
import { on } from 'events';

// 型導入
import {  PointProperties, lyricProperties, historyProperties } from '../types/types';

export const MapComponent = (props: any) => {
  const [clickedPoints, setClickedPoints] = useState<PointProperties[]>([]);
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([]);
  const position: [number, number] = [34.6937, 135.5021];
  const [center, setCenter] = useState<[number, number]>(position);
  const [isMoving, setIsMoving] = useState<boolean>(true);
  const [timer, setTimer] = useState(0);

  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    34.3395651, 135.18270817
  ]);
  const [clickedCount, setClickedCount] = useState<number>(0);
  const [pointPositions, setPointPositions] = useState<[number, number][]>([]);
  const [panels, setPanels] = useState<string[]>([]);
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const [isInit, setIsInit] = useState<Boolean>(true);

  const layerRef = useRef(null);


  const [songKashi, setKashi] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 });


  const PathWay: React.FC = () => {
    const [features, nodes] = computePath()

    if (features) {
      const geojson = {
        type: "FeatureCollection",
        features: features
      }
      return (
        <GeoJSON
          data={geojson as GeoJSON.GeoJsonObject}
          style={mapStylePathWay}
        />
      )
    } else {
      return null
    }
  }

  // 機能テスト用
  // isMovingの値が変わったら実行
  // コンポーネントとして実行しないと動かない?

  const MoveMapByRoute = () =>{
    
    const map = useMap();
    const EPSILON = 0.000000000000001;
    const speed = 0.0001
    const smoothly = 100
    const accuracyPosition = 3
    const vector = (
      position: [number, number],
      nextPosition: [number, number],
    ): [number, number, number] => {
      const distance: number = Math.sqrt((nextPosition[0] - position[0]) ** 2 + (nextPosition[1] - position[1]) ** 2)
      // const distance :number = 1;
      return [
        (nextPosition[0] - position[0]),
        (nextPosition[1] - position[1]),
        distance
      ];
    };

    useEffect(() => {
      // console.log(isMoving)
      // falseの場合動かない
      console.log("ref", layerRef.current.getMaplibreMap())
      if (!props.isMoving) {
        return;
      }

      const timerId = setInterval(() => {
        
        // 移動するためのベクトルを計算（単位ベクトルなので速度は一定）
        const [vector_lat, vector_lon, distance] = vector(
          routePositions[0],
          routePositions[1],
        );
        // 移動処理
        // console.log(routePositions[0][0], routePositions[0][1], vector_lat,  vector_lon, distance, routePositions.length)

        // 現在値がroute_positionsと同じ値になったらroute_positionsの先頭の要素を削除
        if (Math.abs(routePositions[1][0] - map.getCenter().lat) <= Math.abs(vector_lat / distance * speed) ||
          Math.abs(routePositions[1][1] - map.getCenter().lng) <= Math.abs(vector_lon / distance * speed)) {
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
            [routePositions[0][0] + vector_lat / (distance + EPSILON) * timer * speed,
            routePositions[0][1] + vector_lon / (distance + EPSILON) * timer * speed],
            17
          );
        }
        setTimer((prevTimer) => prevTimer + 1);
        console.log(timer)
      }, 16);
      // falseのreturnの跡にintervalの値をclearにリセット
      return () => {
        clearInterval(timerId);
      };
    }, [props.isMoving]);
    // コンポーネントとしての利用のために
      return null;
  }

  const initProcess = () =>{
    if(isInit){
      console.log("init process", layerRef.current)
      const [features, nodes] = computePath()
      setRoutePositions(nodes)
      setIsInit(false)

    }
  }

  initProcess()

  // 👽歌詞表示コンポーネント👽
  // コンポーネントとして実行しないと動かない?
  const MapKashi = () => {
    const map = useMap();
    // console.log(map.getSize(), map.getCenter(), map.getBounds())
    // 歌詞が変わったら実行 ボカロによって色を変える
    if (props.kashi.text != "" && props.kashi != songKashi) {
      // console.log("歌詞が違う")
      setKashi(props.kashi)
      let printKashi: string = "";
      props.kashi.text.split('').forEach((char: string) => {
        printKashi += "<span class=";
        switch (checkKashiType(char)) {
          case KashiType.HIRAGANA:
            printKashi += "'hiragana";
            break;
          case KashiType.KATAKANA:
            printKashi += "'katakana";
            break;
          case KashiType.KANJI:
            printKashi += "'kanji";
            break;
          case KashiType.ENGLISH:
            printKashi += "'english";
            break;
          case KashiType.NUMBER:
            printKashi += "'number";
            break;
          case KashiType.SYMBOL:
            printKashi += "'symbol";
            break;
          case KashiType.SPACE:
            printKashi += "'space";
            break;
          default:
            printKashi += "'other";
            break;
        }
        printKashi += " " + songData[props.songnum].vocaloid.name + "'>" + char + "</span>";
      });
      console.log(printKashi);
      // 歌詞を表示する座標をランダムに決定
      const mapCoordinate: [number, number] =
        [Math.random() * (map.getBounds().getNorth() - map.getBounds().getSouth()) +
          map.getBounds().getSouth(),
        Math.random() * (map.getBounds().getEast() - map.getBounds().getWest()) +
        map.getBounds().getWest()];
      // console.log(mapCoordinate);
      // 地図の表示範囲内にランダムに歌詞配置
      const markertext = marker(mapCoordinate, { opacity: 0 });
      // 表示する歌詞
      // console.log("map", props.kashi)
      markertext.bindTooltip(printKashi, { permanent: true, className: "label-kashi fade-text to_right", direction: "center" })
      // 地図に追加
      markertext.addTo(map);

      return () => {
        markertext.remove(); // Componentはvoidで返すべきではない
      };
    }

    // コンポーネントとしての利用のために
    return null;
  };

  const onPointClick = (e: LeafletMouseEvent) => {
    const clickedPointProperties: PointProperties = {
      name: e.sourceTarget.feature.properties.name,
      coordinates: e.sourceTarget.feature.geometry.coordinates
    };
    // properties.nameとgeometry.coordinatesの値を連想配列として格納
    setClickedPoints(prevPoints => [...prevPoints, clickedPointProperties]);
    console.log(clickedPoints)
  };
  // 👽ポイントにマウスが乗ったときに呼び出される関数👽
  const onPointHover = (e: LeafletMouseEvent) => {
    console.log(e.sourceTarget.feature.properties.name)
    // オフ会0人かどうか
    if(e.sourceTarget.feature.properties.name == "イオンシネマりんくう泉南") {
      console.log("オイイイッス！👽")
    }
    setHoverHistory((prev) => [...new Set([...prev, e.sourceTarget.feature])]);
    console.log(checkArchType(e.sourceTarget.feature.properties.type))
    props.handOverHover(e.sourceTarget.feature)
  }

  // マップに表示されている文字を非表示にする
  // 初期表示にて上手く動かない songnumで解決ゾロリ
  useEffect(() => {
      if (layerRef.current) {
          const map = layerRef.current.getMaplibreMap();
          map.getStyle().layers.forEach(l => {
              if (l.type == "symbol") map.setLayoutProperty(l.id, "visibility", "none")
          });
      }
  }, [props.songnum]);

  return (
    <>
      {/* centerは[緯度, 経度] */}
      {/* zoomは16くらいがgood */}

      <MapContainer className='mapcomponent' center={center} zoom={16} style={{ backgroundColor: '#f5f3f3' }} dragging={true} attributionControl={false}>
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
              click: onPointClick, // ポイントがクリックされたときに呼び出される関数
              mouseover : onPointHover, // ポイントにマウスが乗ったときに呼び出される関数
            });
          }}
        />
        <PathWay />
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/osm_bright.json" // https://docs.stadiamaps.com/map-styles/osm-bright/より取得
          ref={layerRef}
          style={{ backgroundColor: '#f5f3f3'}}
        />
        <MoveMapByRoute />
        <MapKashi />
      </MapContainer>


      {/* 出力確認用、場所を移動させる↓ */}
      {/* これがあるとマップの表示が下にずれる */}
      {/* <ul>
          {clickedPoints.map((point, index) => (
            <li key={index}>
              Name: {point.name}, Coordinates: {point.coordinates}
            </li>
          ))}
        </ul> */}
      {/* 出力確認用、場所を移動させる↑ */}
    </>
  );
};
