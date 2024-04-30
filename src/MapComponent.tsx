import React, { useState, useEffect, useCallback } from 'react';
import {
  MapContainer,
  GeoJSON,
  Circle,
  Tooltip,
  useMap,
  Marker,
} from 'react-leaflet';
import {PathOptions, StyleFunction} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import fantasyGeoJson from './maps/CreatedMap.tsx';
import './App.css';

// interface GeoJSONProps {
//   fillColor?: string;
//   weight?: number;
//   opacity?: number;
//   color?: string;
//   fillOpacity?: number;
//   radius?: number;
// }

const MapComponent: React.FC = () => {
  const position: [number, number] = [37.776554, -122.475891];
  const [center, setCenter] = useState<[number, number]>(position);
  const [isMoving, setIsMoving] = useState(false);
  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    37.776554, -122.455891,
  ]);
  const [clickedCount, setClickedCount] = useState(0);
  const [pointPositions, setPointPositions] = useState<[number, number][]>([]);

  // 読み込んだgeojsonのスタイルを決定
  const geoJsonStyle: StyleFunction = (feature) => {
    // プロパティにアクセスする前に、そのプロパティが存在するかを確認
    switch (feature?.geometry?.type) {
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


  // isMovingの値が変わったら実行
  // コンポーネントとして実行しないと動かない?
  const MoveMap = () => {
    const map = useMap();
    useEffect(() => {
      // falseの場合動かない
      if (!isMoving){
        return;
      }
      // trueの場合
      // 50ms毎に平行移動
      const timerId = setInterval(() => {
        setCenter((prevCenter) => [prevCenter[0], prevCenter[1] + 0.001]);
        map.setView(center, 13);
      }, 50);
      // falseのreturnの跡にintervalの値をclearにリセット
      return () => {
          clearInterval(timerId);
      };
    },  [isMoving]);
    // コンポーネントとしての利用のために
    return null;
  };

  const handleMapMove = () => {
    setIsMoving((prevIsMoving) => !prevIsMoving);
  };

  const addPoint = () => {
    const newPoint: [number, number] = [
      center[0] + Math.random() * 0.01,
      center[1] + Math.random() * 0.01,
    ];
    setPointPositions((prevPositions) => [...prevPositions, newPoint]);
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
      <button onClick={addPoint}>
        Add Point
      </button>
      <MapContainer center={center} zoom={13} style={{ height: '500px', width:'500px'}} dragging={false} attributionControl={false}>
        <GeoJSON
          data={fantasyGeoJson as GeoJSON.GeoJsonObject}
          style={geoJsonStyle}
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
        {pointPositions.map((position, index) => (
          <Marker key={index} position={position} />
        ))}
        <MoveMap />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
