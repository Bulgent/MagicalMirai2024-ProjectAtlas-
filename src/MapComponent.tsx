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

// 地図データの導入
import roads from './map_data/roads.json'
import points from './map_data/points.json'
import areas from './map_data/areas.json'

// Pbf関連データの導入
import PbfLayer from './pbf/PbfComponentSetting';
import { vectorTileLayerStyles } from './pbf/Pbfstyles';

// カラーパレットの導入
import songRead from './song_data/Song';

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
  const position: [number, number] = [34.6937, 135.5021];
  const [center, setCenter] = useState<[number, number]>(position);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [circlePosition, setCirclePosition] = useState<[number, number]>([
    34.3395651, 135.18270817
  ]);
  const [clickedCount, setClickedCount] = useState<number>(0);
  const [pointPositions, setPointPositions] = useState<[number, number][]>([]);
  const [panels, setPanels] = useState<string[]>([]);
  const [songKashi, setKashi] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 });
  // console.log(props.kashi, songKashi)

  // 👽歌詞の種類を判別するための正規表現👽
  const hiraganaRegex = /^[ぁ-ん]+$/;
  const katakanaRegex = /^[ァ-ン]+$/;
  const kanjiRegex = /^[一-龥]+$/;
  const englishRegex = /^[a-zA-Z]+$/;
  const numberRegex = /^[0-9]+$/;
  const symbolRegex = /^[!-/:-@[-`{-~、。！？「」]+$/;
  const spaceRegex = /^\s+$/;

  // 👽歌詞の種類👽
  const enum KashiType {
    HIRAGANA = 0,
    KATAKANA = 1,
    KANJI = 2,
    ENGLISH = 3,
    NUMBER = 4,
    SYMBOL = 5,
    SPACE = 6,
    OTHER = 7
  }

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
          weight: 5,
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

  // 👽歌詞の種類を判別する👽
  const checkKashiType = (text: string): KashiType => {
    if (hiraganaRegex.test(text)) {
      console.log(text, "ひらがな")
      return KashiType.HIRAGANA;
    }
    else if (katakanaRegex.test(text)) {
      console.log(text, "カタカナ")
      return KashiType.KATAKANA;
    }
    else if (kanjiRegex.test(text)) {
      console.log(text, "漢字")
      return KashiType.KANJI;
    }
    else if (englishRegex.test(text)) {
      console.log(text, "英語")
      return KashiType.ENGLISH;
    }
    else if (numberRegex.test(text)) {
      console.log(text, "数字")
      return KashiType.NUMBER;
    }
    else if (symbolRegex.test(text)) {
      console.log(text, "記号")
      return KashiType.SYMBOL;
    }
    else if (spaceRegex.test(text)) {
      console.log(text, "スペース")
      return KashiType.SPACE;
    }
    else {
      console.log(text, "その他")
      return KashiType.OTHER;
    }
  };

  // 👽歌詞表示コンポーネント👽
  // コンポーネントとして実行しないと動かない?
  const MapKashi = () => {
    const map = useMap();
    // console.log(map.getSize(), map.getCenter(), map.getBounds())
    // 歌詞が変わったら実行
    // ボカロによって色を変える
    // if (props.songnum != -1) {
    //   console.log(songRead[props.songnum].vocaloid.name)
    // }
    if (props.kashi.text != "" && props.kashi != songKashi) {
      // console.log("歌詞が違う")
      setKashi(props.kashi)
      let printKashi: string = "";
      props.kashi.text.split('').forEach((char: string) => {
        switch (checkKashiType(char)) {
          case KashiType.HIRAGANA:
            printKashi += "<span class='hiragana " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
          case KashiType.KATAKANA:
            printKashi += "<span class='katakana " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
          case KashiType.KANJI:
            printKashi += "<span class='kanji " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
          case KashiType.ENGLISH:
            printKashi += "<span class='english " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
          case KashiType.NUMBER:
            printKashi += "<span class='number " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
          case KashiType.SYMBOL:
            printKashi += "<span class='symbol " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
          case KashiType.SPACE:
            printKashi += "<span class='space " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
          default:
            printKashi += "<span class='other " + songRead[props.songnum].vocaloid.name + "'>" + char + "</span>";
            break;
        }
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

  // コンポーネントとして実行しないと動かない?
  // const MapKashi = () => {
  //   const map = useMap();
  //   // console.log(map.getSize(), map.getCenter(), map.getBounds())
  //   // var markertext = L.marker(map.getCenter(), { opacity: 1 });
  //   if(props.kashi!=""){
  //     var markertext = L.marker([Math.random() *
  //       (map.getBounds().getNorth() -
  //         map.getBounds().getSouth()) +
  //       map.getBounds().getSouth(),
  //       Math.random() *
  //       (map.getBounds().getEast() -
  //         map.getBounds().getWest()) +
  //       map.getBounds().getWest()], { opacity: 1 });
  //     markertext.bindTooltip(props.kashi, { permanent: true })
  //     markertext.addTo(map);
  //   }

  //   // コンポーネントとしての利用のために
  //   return null;
  // };


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
        <MoveMap />
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
      <button onClick={handleMapMove}>
        {isMoving ? '停止' : '地図を移動'}
      </button>
      <button onClick={addPoint}>
        Add Point
      </button>
    </>
  );
};
