import React, { useState, useEffect, useCallback } from 'react';
import {
  MapContainer,
  GeoJSON,
  Circle,
  Tooltip,
  useMap,
  Marker,
  useMapEvent
} from 'react-leaflet';
import { StyleFunction } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
// import PbfLayer from './PbfComponentSetting';

// 地図データの導入
import roads from './map_data/roads.json'
import points from './map_data/points.json'
import areas from './map_data/areas.json'

// Pbf関連データの導入
import PbfLayer from './pbf/PbfComponentSetting';
import pbfStyle from './pbf/PbfLayerStyle.json'


export const MapComponent: React.FC = (kashi) => {

  const position: [number, number] = [34.6937, 135.5021];
  const [center, setCenter] = useState<[number, number]>(position);
  const [isMoving, setIsMoving] = useState(false);
  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    34.3395651, 135.18270817
  ]);
  const [clickedCount, setClickedCount] = useState(0);
  const [pointPositions, setPointPositions] = useState<[number, number][]>([]);
  const [panels, setPanels] = useState<string[]>([]);
  const [songKashi, setKashi] = useState(kashi)
  // console.log(kashi.char);
  // pointデータを図形として表現
  const pointToLayer = (feature, latlng) => {
    const circleMarkerOptions = {
      radius: 6,
      fillColor: 'white',
      color: 'red',
      weight: 2,
      fillOpacity: 1.5,
    };
    return L.circleMarker(latlng, circleMarkerOptions);
  };

  // line, polygonデータを図形として表現
  const mapStyle: StyleFunction = (feature) => {
    switch (feature?.geometry?.type) {
      case 'MultiLineString':
        return {
          color: '#99abc2',
          weight: 5,
        };
      case 'MultiPolygon':
        return {
          fillColor: '#f6f6f6',
          weight: 2,
          opacity: 1,
          color: 'green',
          fillOpacity: 1,
        };
      default:
        return {};
    }
  };

  const pbfStyle: StyleFunction = (feature) =>{

  }

  // 機能テスト用
  // isMovingの値が変わったら実行
  // コンポーネントとして実行しないと動かない?
  const MoveMap = () => {
    const map = useMap();
    useEffect(() => {
      // falseの場合動かない
      if (!isMoving) {
        return;
      }
      // trueの場合
      // 50ms毎に平行移動
      const timerId = setInterval(() => {
        setCenter((prevCenter) => [prevCenter[0], prevCenter[1] + 0.001]);
        map.setView(center, 16);
      }, 50);
      // falseのreturnの跡にintervalの値をclearにリセット
      return () => {
        clearInterval(timerId);
      };
    }, [isMoving]);
    // コンポーネントとしての利用のために
    return null;
  };

  // 機能テスト用
  // isMovingを切り替える（地図移動の発火点）
  const handleMapMove = () => {
    setIsMoving((prevIsMoving) => !prevIsMoving);
  };

  // 機能テスト用
  // 描画するpointを追加する
  const addPoint = () => {
    const newPoint: [number, number] = [
      center[0] + Math.random() * 0.01,
      center[1] + Math.random() * 0.01,
    ];
    setPointPositions((prevPositions) => [...prevPositions, newPoint]);
  };

  // 機能テスト用
  // カウントを増やして描画する位置を変更
  // useCallbackを使う理由が分からない
  const handleCircleClick = useCallback(() => {
    setClickedCount((count) => count + 1);
    setCirclePosition([
      center[0] + Math.random() * 0.01,
      center[1] + Math.random() * 0.01,
    ]);
  }, []);

  // 機能テスト用
  // 描画する文字を追加する
  const addSomePanels = (index: number, key: string) => {
    const newPanel: string = `clicked ${key}`;
    setPanels((prevPanels) => [...prevPanels, newPanel]);
    setPointPositions((prevPositions) =>
      prevPositions.filter((_, i) => i !== index)
    );
  };

  // if(kashi.char){
  //   addSomePanels(1, kashi.char)
  // }


  // 👽
  function MapEvent() {
    const map = useMapEvent("click", (location) => {
       map.setView(location.latlng, map.getZoom(), {
         animate: true,
       });

      //ポップアップ
      // map.openPopup('<div>popup</div>', location.latlng)

      // ツールチップ
      // map.openTooltip('<p>toolTip</p>', location.latlng)

      //ズームイン・ズームアウト
      // map.zoomIn(1)
      // map.zoomOut(1)

      //現在の位置情報
      // map.locate({
      //     setView: true
      // })

      //中心
      // console.log(map.getCenter())

      //境界座標
      // console.log(map.getBounds())

      //マップサイズ
      // console.log(map.getSize())
    });

  }



  // ?と:でif文を書いている:がelse
  const clickedText =
    clickedCount === 0
      ? 'Click this Circle to change the Tooltip text'
      : `Circle click: ${clickedCount}`;
  const weight_pbf = 0.1
  return (
    <>

      {/* centerは[緯度, 経度] */}
      {/* zoomは16くらいがgood */}

      <MapContainer className='mapcomponent' center={center} zoom={16} style={{ backgroundColor: '#90dbee' }} dragging={true} attributionControl={false}>
        {/* <GeoJSON
          data={areas as GeoJSON.GeoJsonObject}
          style={mapStyle}
        /> */}
        <GeoJSON
          data={roads as GeoJSON.GeoJsonObject}
          style={mapStyle}
        />
        <GeoJSON
          data={points as GeoJSON.GeoJsonObject}
          pointToLayer={pointToLayer}
        />

         <PbfLayer
          url="https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"
          maxNativeZoom={16} // 解像度を調整（値が小さい程データ量が小さい）
          minNativeZoom={16}
          vectorTileLayerStyles={
            {
              "lake": {
                color: "#90dbee",
                opacity: 1,
                weight: 0.5,
                fill:true,
                fillColor:"#90dbee",
                fillOpacity:1,
              },
              "waterarea": {
                color: "#90dbee",
                opacity: 1,
                weight: 0.5,
                fill:true,
                fillColor:"#90dbee",
                fillOpacity:1,
              },
              "river": {
                color: "#90dbee",
                opacity: 1,
                weight: 0.5
              },
              "building": {
                color: "#9d9da0",
                opacity: 1,
                weight: 0.5,
                fill:true,
                fillColor:"#e8e9ed",
                fillOpacity:1,
              },
              "road": {
                color: "#b5c5d3",
                opacity: 0,
                weight: 0.5,
              },

              // ここから下は多分いらない（見えないようにopacity:0）
              "coastline": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "wstructurea": {
                color: "red",
                opacity: 1,
                weight: 0.5,
                fill:true,
                fillColor:"#red",
                fillOpacity:1,
              },
              "structurel": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "landforma": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "transp": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "label": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "elevation": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "contour": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "landforml": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "boundary": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "searoute": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "symbol": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "structurea": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "landformp": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
              "railway": {
                color: "red",
                opacity: 0,
                weight: 0.5
              },
            }
        }
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
        panels.map((label) => (
          <p>{label}</p>
        ))
      }
      <button onClick={handleMapMove}>
        {isMoving ? '停止' : '地図を移動'}
      </button>
      <button onClick={addPoint}>
        Add Point
      </button>
    </>
  );
};
