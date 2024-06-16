import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, GeoJSON, Circle, Tooltip, useMap, Marker } from 'react-leaflet';
import { LeafletMouseEvent, marker, Map, point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/App.css';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import { computePath } from '../services/ComputePath.ts'
import { checkArchType, formatKashi, calculateVector } from '../utils/utils.ts'
import { pointToLayer, mapStyle, mapStylePathWay } from '../utils/MapStyle.ts'

// 地図データの導入
import roads from '../assets/jsons/map_data/roads-kai.json'
import points from '../assets/jsons/map_data/points.json'
import areas from '../assets/jsons/map_data/areas.json'

// songDataの導入
import songData from '../utils/Song.ts';

import { PointProperties, lyricProperties, historyProperties } from '../types/types';

type noteTooltip = {
  fwdLength: number; // 前方の距離
  crtLength: number; // 現在の距離
  crtPosStart: [lat: number, lng: number]; // 現在の座標始まり
  crtPosEnd: [lat: number, lng: number]; // 現在の座標終わり
};

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
  const layerRef = useRef(null);
  const [songKashi, setKashi] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 });
  const [isInitMap, setIsInitMap] = useState<Boolean>(true);

  const [noteCoordinates, setNoteCoordinates] = useState<{ note: string, lat: number, lng: number }[]>([]);

  // 初回だけ処理
  useEffect(() => {
    // console.log("init process", layerRef.current);
    const [features, nodes] = computePath();
    setRoutePositions(nodes);
    setPathwayFeature(features);
  }, []); // 空の依存配列を渡すことで、この効果はコンポーネントのマウント時にのみ実行されます。


  // 👽マーカーの表示(単語によって色を変える)👽 
  // TODO 歌詞の長さでの配置にする．
  const AddNotesToMap = () => {
    const map = useMap();
    useEffect(() => {
      if (props.songnum == -1 || props.songnum == null || !isInitMap) {
        return
      }

      // 歌詞の時間を取得
      let wordTemp = props.player.video.firstWord
      let wordTime: { lyric: string, start: number, end: number }[] = [{
        lyric: "",
        start: 0,
        end: wordTemp.startTime
      }]
      while (wordTemp.next != null) {
        wordTime.push({
          lyric: wordTemp.text,
          start: wordTemp.startTime,
          end: wordTemp.endTime
        })
        wordTemp = wordTemp.next
      }
      // 最後の歌詞を追加
      wordTime.push({
        lyric: wordTemp.text,
        start: wordTemp.startTime,
        end: wordTemp.endTime
      })
      wordTime.push({
        lyric: "",
        start: props.player.video.duration,
        end: props.player.video.duration
      })

      // 道路の長さを取得
      const [_, nodes] = computePath();
      let routeLength: noteTooltip[] = [];
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
      // console.log("曲長さ:", props.player.video.duration, "道長さ:", routeEntireLength)
      console.log(songData[props.songnum].note + "の数:", props.player.video.wordCount)
      const noteNum = props.player.video.wordCount; // 264 player.video.wordCount
      const noteGain = routeEntireLength / props.player.video.duration;
      const noteLength = wordTime.map((word) => word.start * noteGain);
      let noteCd: { note: string; lat: number; lng: number; }[] = [];
      // console.log("gain", noteGain)
      // console.log("noteLength", noteLength)

      // SVG アイコンの HTML 文字列を定義
      const svgAlien = '<svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg"><g id="color"><path fill="#d0cfce" d="m56.7269,32.3778c0,5.4783-2.5938,10.7782-5.1217,15.641-.6345,1.2206-1.6558,1.9659-2.3853,3.0844-.608.9322-.9846,2.239-1.6421,3.0841-3.9933,5.1332-7.7668,8.8127-11.6352,8.8127-3.8271,0-7.7665-3.3191-11.7333-8.3606-.6817-.8663-1.1468-2.4572-1.7765-3.4172-.5315-.8103-1.6251-2.4093-2.1087-3.2757-2.8522-5.1095-5.1658-9.6774-5.1658-15.5687,0-14.9608,10.3921-22.3778,20.7843-22.3778s20.7843,7.417,20.7843,22.3778Z"/><path fill="#9b9b9a" d="m36.9426,62.25c6-5,11.8534-46.3572,11.9267-47.3036,3.1087,2.5414,7.1004,8.9255,7.725,13.0321,1.1644,7.6568-2.3965,17.7826-7.3743,23.1247-5.16,11.1091-12.2774,11.1468-12.2774,11.1468"/><path fill="#3f3f3f" d="m22.5696,42.348c1.9926,3.7,5.3442,5.7121,7.4861,4.4943,2.1418-1.2178,2.2628-5.2045.2702-8.9045s-5.3442-5.7121-7.4861-4.4943-2.2628,5.2046-.2702,8.9045Z"/><path fill="#3f3f3f" d="m49.0317,42.348c-1.9926,3.7-5.3442,5.7121-7.4861,4.4943-2.1418-1.2178-2.2628-5.2045-.2702-8.9045s5.3442-5.7121,7.4861-4.4943c2.1418,1.2179,2.2628,5.2046.2702,8.9045Z"/></g><g id="line"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m30.7465,53.6689c.4295.4051,2.3337,2.11,5.1016,1.9273,2.2456-.1483,3.7515-1.4526,4.2513-1.9273"/><path fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" d="m22.5696,42.348c1.9926,3.7,5.3442,5.7121,7.4861,4.4943,2.1418-1.2178,2.2628-5.2045.2702-8.9045s-5.3442-5.7121-7.4861-4.4943-2.2628,5.2046-.2702,8.9045Z"/><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m35.9426,63c-8.125,0-11.9655-7.7752-13.12-10.6909-.2705-.6831-.6645-1.3029-1.1743-1.8319-1.8804-1.9513-6.49-7.7864-6.49-18.0994,0-14.9608,10.3921-22.3778,20.7843-22.3778s20.7843,7.417,20.7843,22.3778c0,10.3722-4.1733,15.6905-6.2294,17.8189-.6696.6932-1.2358,1.4796-1.6556,2.3472-4.0276,8.3235-8.733,10.4561-12.8993,10.4561Z"/><path fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" d="m49.0317,42.348c-1.9926,3.7-5.3442,5.7121-7.4861,4.4943-2.1418-1.2178-2.2628-5.2045-.2702-8.9045s5.3442-5.7121,7.4861-4.4943c2.1418,1.2179,2.2628,5.2046.2702,8.9045Z"/></g></svg>';
      const svgUnicorn = '<svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg"><g id="color"><path fill="#FFFFFF" stroke="none" d="M23.7544,12.3618l1.6667,7.1667l-5.3333,5.3333l-8.3333,14.3333l1,4.6667l2.1667,1.3333l4-0.1667 l3.5-3.3333l6.8333-1.8333c0,0,1.3333,1.5,2.1667,3s3.6667,4.1667,3.6667,4.1667l0.5,6l-1.8333,6.1667l-2,2.8333 c0,0,22,9.5,33.1667-7l-0.5-6l-1.8333-5l-3.3333-5.1667l-1-1.5l-0.1667-5.1667l-2.8333-5.3333l-5-3l-2.6667-4.5l-5.1667-4.1667 l-6.5-1.5l-5.6667,1l-4.1667-2.1667L23.7544,12.3618z"/><path fill="#EA5A47" stroke="none" d="M50.671,23.155l5.2083,4.095c0,0,5.5638,8.2181-0.3258,17.8201c-7.0492,11.4924,0,0,0,0 c-1.6183,3.4754-2.3141,6.7423-1.738,9.7216l-5.3111-4.4167V34.2917L50.671,23.155z"/><polyline fill="#EA5A47" stroke="none" points="25.8985,19.2712 10.7847,12.0212 15.951,18.1399 21.1747,23.995 25.8985,19.2712"/><path fill="#92D3F5" stroke="none" d="M29.7367,13.6311l10.7677,0.1362c0,0,9.2377,4.0661,10.5355,11.8161l0.6874,8.9567 c-2.6337,6.5386-3.0562,14.1267,2.0883,20.8336l0,0c0,0-7.1444,1.3215-9.8944-7.1094L42.3377,43.5l0.3258-6.0341l1.4169-5.6426 l-0.2833-4.8929l-2.2761-4.3124l-3.5322-2.8413l-5.792-2.0801L29.7367,13.6311"/><path fill="#61B2E4" stroke="none" d="M58.4549,36.75c0,0,5.5192,6.4066,6.9982,15.1193c0.1838,1.0826,0.1251,2.193-0.1377,3.2591 c-0.4317,1.7512-0.8179,4.9979,0.1452,7.3825c0.4689,1.1611-0.5621,2.3655-1.7883,2.1115 c-3.7094-0.7686-9.2437-3.6474-10.2567-8.0876c-0.0239-0.1047-0.0368-0.2138-0.0417-0.321l-0.266-5.7459 c-0.0132-0.2857,0.0516-0.5695,0.1875-0.8211l3.692-6.8359c0.0666-0.1233,0.1164-0.2549,0.1482-0.3914L58.4549,36.75"/></g><g id="hair"/><g id="skin"/><g id="skin-shadow"/><g id="line"><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M58.4549,37.7826C60.2229,40.1443,65,44.4647,64.5,54.0208"/><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M32.5,41.8854c0,0,8.4783,6.7823,0,18.7647"/><polyline fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" points="24.809,19.1338 10.25,11.75 21.1747,23.995"/><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M35.1962,30.8696c0.5489,8.3555-9.3225,9.703-11.954,10.3347c-0.3325,0.0798-0.6318,0.25-0.8736,0.4919l-2.2227,2.2227 c-0.3494,0.3494-0.8234,0.5458-1.3176,0.5458h-3.5121c-1.203,0-2.2711-0.7698-2.6515-1.9111l-0.531-1.5931 c-0.258-0.774-0.1649-1.6222,0.2549-2.3218l8.7862-14.6436l4.7238-4.7238l-2.1151-6.9054c0,0,7.8026-0.6987,8.4135,5.3308 c0,0,16.9281,2.4418,10.5531,19.383c0,0-1.625,5.9489,2.375,11.1846"/><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M30.9167,14.0208c0,0,22.2444-4.0208,19.9583,19.9583"/><path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M49.9187,23.155c0,0,14.7665,6.5865,5.4563,22.22c0,0-5.375,6.5625,0.625,13.6042"/><circle cx="24.4167" cy="28.9304" r="2" fill="#000000" stroke="none"/></g></svg>';
      const svgNote = '<svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg"><g id="color"><polygon fill="#3F3F3F" stroke="none" points="26.324,22.8117 51.6188,17.5516 51.5493,12.875 26.105,18.5407"/><circle cx="20.7561" cy="51.59" r="5.7867" fill="#3F3F3F" stroke="none"/><circle cx="46.2061" cy="46.0127" r="5.787" fill="#3F3F3F" stroke="none"/></g><g id="hair"/><g id="skin"/><g id="skin-shadow"/><g id="line"><polygon fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" points="51.6188,17.5516 26.1735,23.2225 26.105,18.5407 51.5493,12.875"/><circle cx="20.7563" cy="51.5901" r="5.7868" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><line x1="26.105" x2="26.5431" y1="18.5407" y2="51.5901" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><circle cx="46.2063" cy="46.0129" r="5.7868" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><line x1="51.555" x2="51.9931" y1="12.9635" y2="46.0129" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></g></svg>';

      // 歌詞の時間を元に🎵を配置
      noteLength.forEach((noteLen, index) => {
        // 歌詞の座標の含まれる道路を探す
        const noteIndex = routeLength.findIndex((route) => route.fwdLength <= noteLen && noteLen <= route.fwdLength + route.crtLength);
        // 歌詞の座標が含まれる道路の情報を取得
        const crtRoute = routeLength[noteIndex];
        // 歌詞の座標が含まれる道路の中での距離を計算
        const crtDistance = noteLen - crtRoute.fwdLength;
        const crtLat = crtRoute.crtPosStart[0] + (crtRoute.crtPosEnd[0] - crtRoute.crtPosStart[0]) * (crtDistance / crtRoute.crtLength);
        const crtLng = crtRoute.crtPosStart[1] + (crtRoute.crtPosEnd[1] - crtRoute.crtPosStart[1]) * (crtDistance / crtRoute.crtLength);
        let tooltipString = "🎵" // 表示する文字
        let markerSVG = "" // 表示するSVG
        switch (index) {
          case 0: // 最初
            tooltipString = "👽"
            markerSVG = svgAlien
            break;
          case noteNum + 1: // 最後
            tooltipString = "🦄"
            markerSVG = svgUnicorn
            break;
          default: // それ以外
            tooltipString = songData[props.songnum].note
            markerSVG = svgNote
            break;
        }
        noteCd.push({
          note: tooltipString,
          lat: crtLat,
          lng: crtLng
        })

        // L.icon を使用してカスタムアイコンを設定
        const customIcon = L.divIcon({
          className: 'custom-icon', // カスタムクラス名
          html: markerSVG, // SVG アイコンの HTML
          iconSize: [50, 50], // アイコンのサイズ
          iconAnchor: [25, 50] // アイコンのアンカーポイント
        });

        // 歌詞の座標に🎵を表示
        const lyricMarker = marker([crtLat, crtLng], { icon: customIcon, opacity: 1 }).addTo(map);
        lyricMarker.bindTooltip(wordTime[index].lyric,
          { permanent: true, direction: 'bottom', interactive: true, className: "label-note" }).openTooltip();

        lyricMarker.on('click', function (e) {
          console.log("click")
          // ツールチップの文字取得
          const tooltip = e.target.getTooltip();
          const content = tooltip.getContent();
          console.log(content);
        });
      });

      // console.log(wordTime)
      // console.log(noteCd)
      // noteCdとwordTimeが既に定義されていると仮定

      setNoteCoordinates(noteCd);
      setIsInitMap(false)
      return () => {
        console.log("unmount note")
      };
    }, [props.songnum, props.player?.video.wordTemp, isInitMap]);
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
  const addLyricTextToMap = (map: Map) => {
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
      console.log(printKashi);
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
      markertext.bindTooltip(printKashi, { permanent: true, sticky: true, interactive: false, className: "label-kashi fade-text to_right", direction: "bottom" })
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
      </MapContainer>
    </>
  );
};