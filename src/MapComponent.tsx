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
import { computePath } from './ComputePath'
import { roundWithScale, KashiType, checkKashiType, ArchType, checkArchType } from './utils.ts'

// 地図データの導入
import roads from './map_data/roads.json'
import points from './map_data/points.json'
import areas from './map_data/areas.json'

// Pbf関連データの導入
import PbfLayer from './pbf/PbfComponentSetting';
import { vectorTileLayerStyles } from './pbf/Pbfstyles';

// カラーパレットの導入
import songRead from './song_data/Song';
import { on } from 'events';

interface PointProperties {
  name: string;
  coordinates: [number, number];
}
interface kashiProperties {
  text: string;
  startTime: number;
  endTime: number;
}

export const MapComponent = (props: any) => {
  const [clickedPoints, setClickedPoints] = useState<PointProperties[]>([]);
  const [hoverHistory, setHoverHistory] = useState<PointProperties[]>([]);
  const position: [number, number] = [34.6937, 135.5021];
  const [center, setCenter] = useState<[number, number]>(position);
  const [isMoving, setIsMoving] = useState<boolean>(true);

  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    34.3395651, 135.18270817
  ]);
  const [clickedCount, setClickedCount] = useState<number>(0);
  const [pointPositions, setPointPositions] = useState<[number, number][]>([]);
  const [panels, setPanels] = useState<string[]>([]);
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const [isInit, setIsInit] = useState<Boolean>(true);
  const [songKashi, setKashi] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 });

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

  // console.log(points.features[0].properties.type)

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
          opacity: 0.5,
        };
      default:
        return {};
    }
  };

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
  const MoveMapByRoute = () => {

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
      if (!props.isMoving) {
        return;
      }

      let timer: number = 0;
      const timerId = setInterval(() => {

        // 移動するためのベクトルを計算（単位ベクトルなので速度は一定）
        const [vector_lat, vector_lon, distance] = vector(
          routePositions[0],
          routePositions[1],
        );
        console.log(vector_lat, vector_lon)
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
            timer = 0
            setRoutePositions(routePositions.slice(1));
          }
        } else {
          map.setView(
            [routePositions[0][0] + vector_lat / (distance + EPSILON) * timer * speed,
            routePositions[0][1] + vector_lon / (distance + EPSILON) * timer * speed],
            17
          );
        }
        timer++;
      }, 16);
      // falseのreturnの跡にintervalの値をclearにリセット
      return () => {
        clearInterval(timerId);
      };
    }, [props.isMoving]);
    // コンポーネントとしての利用のために
    return null;
  }

  const initProcess = () => {
    if (isInit) {
      const [features, nodes] = computePath()
      setRoutePositions(nodes)
      setIsInit(false)
    } else {

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
        printKashi += " " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
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
      const markertext = L.marker(mapCoordinate, { opacity: 0 });
      // 表示する歌詞
      // console.log("map", props.kashi)
      markertext.bindTooltip(printKashi, { permanent: true, className: "label-kashi fade-text to_right", direction: "center" })
      // 地図に追加
      markertext.addTo(map);

      return () => {
        markertext.remove();
      };
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
    console.log(clickedPoints)
  };
  // 👽ポイントにマウスが乗ったときに呼び出される関数👽
  const onPointHover = (e: LeafletMouseEvent) => {
    console.log(e.sourceTarget.feature.properties.name)
    //hoverhistoryに施設名と座標を配列で追加
    const hoverPointProperties: PointProperties = {
      name: e.sourceTarget.feature.properties.name,
      coordinates: e.sourceTarget.feature.geometry.coordinates
    };
    // オフ会0人かどうか
    if(e.sourceTarget.feature.properties.name == "イオンシネマりんくう泉南") {
      console.log("オイイイッス！👽")
    }
    setHoverHistory(prevPoints => [...prevPoints, hoverPointProperties]); 
    console.log(checkArchType(e.sourceTarget.feature.properties.type))
    props.handOverHover(e.sourceTarget.feature)
  }

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
        <PbfLayer
          url="https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"
          maxNativeZoom={16} // 解像度を調整（値が小さい程データ量が小さい）
          minNativeZoom={16}
          vectorTileLayerStyles={vectorTileLayerStyles} // 外部ファイルからスタイルを読み込む
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
