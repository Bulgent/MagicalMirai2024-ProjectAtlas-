import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, GeoJSON, Circle, Tooltip, useMap, Marker } from 'react-leaflet';
import { LeafletMouseEvent, marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/App.css';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import { computePath } from '../services/ComputePath.ts'
import { KashiType, checkKashiType, ArchType, checkArchType, formatKashi, calculateVector } from '../utils/utils.ts'
import { pointToLayer, mapStyle, mapStylePathWay } from '../utils/MapStyle.ts'

// 地図データの導入
import roads from '../assets/jsons/map_data/roads-kai.json'
import points from '../assets/jsons/map_data/points.json'
import areas from '../assets/jsons/map_data/areas.json'

// カラーパレットの導入s
import songData from '../utils/Song.ts';


import {  PointProperties, lyricProperties, historyProperties } from '../types/types';

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
  const [isInit, setIsInit] = useState<Boolean>(true);
  const layerRef = useRef(null);
  const [songKashi, setKashi] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 });

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
  // const PathWay: React.FC = () => {
  //   const [features, nodes] = computePath()

  //   if (features) {
  //     const geojson = {
  //       type: "FeatureCollection",
  //       features: features
  //     }
  //     return (
  //       <GeoJSON
  //         data={geojson as GeoJSON.GeoJsonObject}
  //         style={mapStylePathWay}
  //       />
  //     )
  //   } else {
  //     return null
  //   }
  // }


  const MoveMapByRoute = () =>{
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
        printKashi += formatKashi(char);
        printKashi += " " + songData[props.songnum].vocaloid.name + "'>" + char + "</span>";
      });
      console.log(printKashi);
      // 歌詞を表示する座標をランダムに決定
      // フォントサイズを定義（ピクセル単位）
      const fontSizePx = 12;
      // ピクセル単位のフォントサイズを地理座標に変換するための仮定の係数
      const conversionFactor = 0.0001;

      // フォントサイズに基づいて座標の範囲を調整
      const adjustedNorth = map.getBounds().getNorth() - (fontSizePx * conversionFactor);
      const adjustedSouth = map.getBounds().getSouth() + (fontSizePx * conversionFactor);
      const adjustedEast = map.getBounds().getEast() - (fontSizePx * conversionFactor);
      const adjustedWest = map.getBounds().getWest() + (fontSizePx * conversionFactor);

      // 調整された範囲を使用してランダムな座標を生成
      const mapCoordinate: [number, number] = [
        Math.random() * (adjustedNorth - adjustedSouth) + adjustedSouth,
        Math.random() * (adjustedEast - adjustedWest) + adjustedWest
      ];
      // const mapCoordinate: [number, number] =
      //   [Math.random() * (map.getBounds().getNorth() - map.getBounds().getSouth()) +
      //     map.getBounds().getSouth(),
      //   Math.random() * (map.getBounds().getEast() - map.getBounds().getWest()) +
      //   map.getBounds().getWest()];
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

  // 初回だけ処理
  if(isInit){
    console.log("init process", layerRef.current)
    // TODO: 1回しか処理をしないreact的な書き方
    const [features, nodes] = computePath()
    setRoutePositions(nodes)
    setPathwayFeature(features)
    setIsInit(false)
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
              mouseover : onPointHover, // ポイントにマウスが乗ったときに呼び出される関数
            });
          }}
        />
        <PathWay />
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/osm_bright.json" // https://docs.stadiamaps.com/map-styles/osm-bright/より取得
          ref={layerRef}
          style={{ backgroundColor: '#f5f3f3' }}
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