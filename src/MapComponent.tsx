import React, { useState, useEffect, useCallback } from 'react';
import {
  MapContainer,
  GeoJSON,
  Circle,
  Tooltip,
  useMap,
  Marker,
} from 'react-leaflet';
import { StyleFunction} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import roads from './map_data/roads.json'
import points from './map_data/points.json'
import L from 'leaflet';


const MapComponent: React.FC = () => {

  const position: [number, number] = [34.70, 135.49];
  const [center, setCenter] = useState<[number, number]>(position);
  const [isMoving, setIsMoving] = useState(false);
  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    34.70, 135.49
  ]);
  const [clickedCount, setClickedCount] = useState(0);
  const [pointPositions, setPointPositions] = useState<[number, number][]>([]);
  const [panels, setPanels] = useState<string[]>([]);

  const pointToLayer = (feature, latlng) => {
    const circleMarkerOptions = {
      radius: 6,
      fillColor: 'red',
      color: 'red',
      weight: 2,
      fillOpacity: 0.5,
    };
    return L.circleMarker(latlng, circleMarkerOptions);
  };

  const mapStyle: StyleFunction = (feature) => {
    switch (feature?.geometry?.type) {
      case 'MultiLineString':
        return {
          color: 'blue',
          weight: 5,
        };
      case 'Point':
        return {
          renderer: L.circleMarker,
          radius: 6, // CircleMarkerの半径を指定
          fillColor: 'red', // CircleMarkerの塗りつぶし色を指定
          color: 'red', // CircleMarkerの線の色を指定
          weight: 2, // CircleMarkerの線の太さを指定
          fillOpacity: 0.5, // CircleMarkerの塗りつぶしの不透明度を指定
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
      center[0] + Math.random() * 0.01,
      center[1] + Math.random() * 0.01,
    ]);
  }, []);

  const addSomePanels = (index, key) => {
    const newPanel: string = `clicked ${key}`;
    setPanels((prevPanels) => [...prevPanels, newPanel]);
    setPointPositions((prevPositions) =>
      prevPositions.filter((_, i) => i !== index)
    );
  };

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
      {/* centerは[緯度, 経度] */}
      <MapContainer center={center} zoom={16} style={{ height: '500px', width:'500px'}} dragging={false} attributionControl={false}>
        <GeoJSON
          data={roads as GeoJSON.GeoJsonObject}
          style={mapStyle}
        />
        <GeoJSON
          data={points as GeoJSON.GeoJsonObject}
          pointToLayer={pointToLayer}
        />
        <Circle
        center={circlePosition}
        eventHandlers={{
          click: handleCircleClick,
        }}
        pathOptions={{ fillColor: 'blue' }}
        radius={6}
        >
        <Tooltip>{clickedText}</Tooltip>
        </Circle>
        {
          pointPositions.map((position) => (
            <Marker
              key={`${position[0]}-${position[1]}`}
              position={position}
              eventHandlers={{
                click: () => addSomePanels(pointPositions.indexOf(position), `${position[0]}-${position[1]}`),
              }}
            />
          ))
        }
        <MoveMap />
      </MapContainer>
      {
        panels.map((label)=>(
          <p>{label}</p>
        ))
      }
    </div>
  );
};

export default MapComponent;
