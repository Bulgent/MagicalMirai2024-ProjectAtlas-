import React, { useState, useEffect, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Circle,
  Tooltip,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import fantasyGeoJson from './maps/CreatedMap.tsx';
import './App.css';

interface FantasyGeoJsonFeature extends GeoJSON.GeoJsonObject {
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

interface GeoJSONProps {
  fillColor?: string;
  weight?: number;
  opacity?: number;
  color?: string;
  fillOpacity?: number;
  radius?: number;
}

const MapComponent: React.FC = () => {
  const position: [number, number] = [37.776554, -122.475891];
  const [center, setCenter] = useState<[number, number]>(position);
  const [isMoving, setIsMoving] = useState(false);
  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    37.776554, -122.455891,
  ]);
  const [clickedCount, setClickedCount] = useState(0);

  // 読み込んだgeojsonのスタイルを決定
  const geoJsonStyle = (feature: FantasyGeoJsonFeature): GeoJSONProps => {
    switch (feature.geometry.type) {
      case 'Polygon':
        return {
          fillColor: 'green',
          weight: 2,
          opacity: 1,
          color: 'green',
          fillOpacity: 0.5,
        };
      case 'LineString':
        return {
          color: 'blue',
          weight: 2,
        };
      case 'Point':
        return {
          fillColor: 'red',
          weight: 2,
          opacity: 1,
          color: 'red',
          fillOpacity: 0.5,
          radius: 100,
        };
      default:
        return {};
    }
  };

  // GeoJSON レイヤーに追加する前に各フィーチャで呼び出される関数
  // フィーチャをクリックしたときにポップアップをアタッチ（だから不必要な機能ではある）
  const onEachFeature = (feature: FantasyGeoJsonFeature, layer: L.Layer) => {
    if (feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  // 地図を自動で動かす
  const MoveMap: React.FC = () => {
    const map = useMap();
    // useInterval
    useEffect(() => {
      let interval: ReturnType<typeof setInterval> | null = null;

      // もし止まっている時にボタンをおしたら
      if (isMoving) {
        // ms秒毎に平行移動を実行
        interval = setInterval(() => {
          setCenter((prevCenter) => [prevCenter[0], prevCenter[1] + 0.001]);
        }, 50);

        // 10秒後に移動を停止する(setTimeoutはsetIntervalと違い一回だけ実行)
        // isMovingをfalseにする
        setTimeout(() => {
          setIsMoving(false);
          if (interval) {
            // timerの停止
            clearInterval(interval);
          }
        }, 10000);
      }

      // マップを中心に移動させる
      // centerの値が変更される度に実行
      map.setView(center, 13);

      return () => {
        if (interval) {
          // コンポーネントがアンマウントされた後に実行されないように、インターバルをクリアする役割（よくわからん）
          clearInterval(interval);
        }
      };
    }, [center, isMoving]);

    return null;
  };

  const handleMapMove = () => {
    setIsMoving((prevIsMoving) => !prevIsMoving);
  };

  const handleCircleClick = useCallback(() => {
    setClickedCount((count) => count + 1);
    setCirclePosition([
      37.776554 + Math.random() * 0.01,
      -122.455891 + Math.random() * 0.01,
    ]);
  }, []);

  const clickedText =
    clickedCount === 0
      ? 'Click this Circle to change the Tooltip text'
      : `Circle click: ${clickedCount}`;

  return (
    <div className="App">
      <button onClick={handleMapMove}>
        {isMoving ? '停止' : '地図を移動'}
      </button>
      <MapContainer center={center} zoom={13} style={{ height: '500px' }}>
        <GeoJSON
          data={fantasyGeoJson as GeoJSON.GeoJsonObject}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
        <Circle
          center={circlePosition}
          eventHandlers={{
            click: handleCircleClick,
          }}
          pathOptions={{ fillColor: 'blue' }}
          radius={200}
        >
          <Tooltip>{clickedText}</Tooltip>
        </Circle>
        {/*  空白のエンティティ */}
        <MoveMap />　
      </MapContainer>
    </div>
  );
};

export default MapComponent;
