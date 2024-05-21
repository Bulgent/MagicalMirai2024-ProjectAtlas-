import React, { useState, useEffect, useCallback } from 'react';
import {
  MapContainer,
  GeoJSON,
  Circle,
  Tooltip,
  useMap,
  Marker,
} from 'react-leaflet';
import { StyleFunction, LeafletMouseEvent, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
// import PbfLayer from './PbfComponentSetting';
import { computePath } from './ComputePath'
import { roundWithScale } from './utils.ts'

// 地図データの導入
import roads from './map_data/roads.json'
import points from './map_data/points.json'
import areas from './map_data/areas.json'

interface PointProperties {
  name: string;
  coordinates: [number, number];
}

export const MapComponent = (props: any) => {
  const [clickedPoints, setClickedPoints] = useState<PointProperties[]>([]);
  const position: [number, number] = [34.6937, 135.5021];
  const [center, setCenter] = useState<[number, number]>(position);

  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    34.3395651, 135.18270817
  ]);
  const [clickedCount, setClickedCount] = useState(0);
  const [pointPositions, setPointPositions] = useState<[number, number][]>([]);
  const [panels, setPanels] = useState<string[]>([]);
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const [isInit, setIsInit] = useState<Boolean>(true);
  const [songKashi, setKashi] = useState(props.kashi)



  // pointデータを図形として表現
  const pointToLayer = (feature: any, latlng: LatLngExpression) => {
    const circleMarkerOptions = {
      radius: 6,
      fillColor: 'white',
      color: 'red',
      weight: 2,
      fillOpacity: 1,
    };
    return L.circleMarker(latlng, circleMarkerOptions);
  };

  // line, polygonデータを図形として表現
  const mapStyle: StyleFunction = (feature) => {
    switch (feature?.geometry?.type) {
      case 'MultiLineString':
        return {
          color: '#99abc2',
          weight: 10,
        };
      case 'MultiPolygon':
        return {
          fillColor: '#90dbee',
          weight: 2,
          opacity: 0.5,
          color: 'gray',
          fillOpacity: 1,
        };
      default:
        return {};
    }
  };

  // line, polygonデータを図形として表現
  const mapStylePathWay: StyleFunction = (feature) => {
    switch (feature?.geometry?.type) {
      case 'MultiLineString':
        return {
          color: 'blue',
          weight: 5,
          opacity:0.5,
        };
      default:
        return {};
    }
  };

  const PathWay: React.FC = () =>{
    const [features, nodes] = computePath()

    if (features){
      const geojson = {
        type:"FeatureCollection",
        features:features
      }
      return(
        <GeoJSON
          data={geojson as GeoJSON.GeoJsonObject}
          style={mapStylePathWay}
        />
      )
    }else{
      return null
    }
  }

  // 機能テスト用
  // isMovingの値が変わったら実行
  // コンポーネントとして実行しないと動かない?
  


  const MoveMapByRoute = () =>{

    const map = useMap();
    const EPSILON = 0.000000000000001;
    const speed = 0.00005
    const smoothly = 100
    const accuracyPosition = 3
    const vector = (
      position: [number, number],
      nextPosition: [number, number],
    ): [number, number, number] => {
      const distance:number = Math.sqrt((nextPosition[0] - position[0])**2+(nextPosition[1] - position[1])**2)
      // const distance :number = 1;
      return [
        (nextPosition[0] - position[0]) ,
        (nextPosition[1] - position[1]) ,
        distance
      ];
    };

    useEffect(() => {
      // falseの場合動かない
      if (!props.isMoving) {
        return;
      }

      let timer:number = 0;
      const timerId = setInterval(() => {

      // 移動するためのベクトルを計算（単位ベクトルなので速度は一定）
        const [vector_lat, vector_lon, distance] = vector(
          routePositions[0],
          routePositions[1],
        );

        // 移動処理
        // console.log(routePositions[0][0], routePositions[0][1], vector_lat,  vector_lon, distance, routePositions.length)
        console.log(map.getCenter().lat, map.getCenter().lng)
        map.setView(
          [routePositions[0][0]+ vector_lat/(distance+EPSILON)*timer*speed, routePositions[0][1] + vector_lon/(distance+EPSILON)*timer*speed],
          16
        );
        timer++;

        // 現在値がroute_positionsと同じ値になったらroute_positionsの先頭の要素を削除
        if (Math.abs(routePositions[1][0]-map.getCenter().lat)<Math.abs(vector_lat)|| 
            Math.abs(routePositions[1][1]-map.getCenter().lng)<Math.abs(vector_lon) ){
          if (routePositions.length <= 2){
            console.log("finish")
            return;
          }else{
            console.log("passed");
            timer = 0
            setRoutePositions(routePositions.slice(1));
          }
        }
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
      const [features, nodes] = computePath()
      setRoutePositions(nodes)
      setIsInit(false)
    }else{

    }
  }

  initProcess()

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

  // 歌詞表示コンポーネント👽
  // コンポーネントとして実行しないと動かない?
  const MapKashi = () => {
    const map = useMap();
    // console.log(map.getSize(), map.getCenter(), map.getBounds())
    // var markertext = L.marker(map.getCenter(), { opacity: 1 });
    if(props.kashi!=""){
      var markertext = L.marker([Math.random() *
        (map.getBounds().getNorth() -
          map.getBounds().getSouth()) +
        map.getBounds().getSouth(),
        Math.random() *
        (map.getBounds().getEast() -
          map.getBounds().getWest()) +
        map.getBounds().getWest()], { opacity: 1 });
      markertext.bindTooltip(props.kashi, { permanent: true })
      markertext.addTo(map);
    }

    // コンポーネントとしての利用のために
    return null;
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

  // ?と:でif文を書いている:がelse 
  const clickedText =
    clickedCount === 0
      ? 'Click this Circle to change the Tooltip text'
      : `Circle click: ${clickedCount}`;

  const onPointClick = (e: LeafletMouseEvent) => {
    const clickedPointProperties: PointProperties = {
      name: e.sourceTarget.feature.properties.name,
      coordinates: e.sourceTarget.feature.geometry.coordinates
    };
    // properties.nameとgeometry.coordinatesの値を連想配列として格納
    setClickedPoints(prevPoints => [...prevPoints, clickedPointProperties]);
  };

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
              click: onPointClick // ポイントがクリックされたときに呼び出される関数
            });
          }}
        />

        <PathWay />
         {/* <PbfLayer
          url="https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"
          maxNativeZoom={16} // 解像度を調整（値が小さい程データ量が小さい）
          minNativeZoom={16}
          vectorTileLayerStyles={
            {
              "lake": {
                color: "#90dbee",
                opacity: 1,
                weight: 0.5,
                fill: true,
                fillColor: "#90dbee",
                fillOpacity: 1,
              },
              "waterarea": {
                color: "#90dbee",
                opacity: 1,
                weight: 0.5,
                fill: true,
                fillColor: "#90dbee",
                fillOpacity: 1,
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
                fill: true,
                fillColor: "#e8e9ed",
                fillOpacity: 1,
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
                fill: true,
                fillColor: "#red",
                fillOpacity: 1,
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
        /> */}

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
        <MoveMapByRoute/>
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

      {
        panels.map((label) => (
          <p>{label}</p>
        ))
      }

      <button onClick={addPoint}>
        Add Point
      </button>
    </>
  );
};
