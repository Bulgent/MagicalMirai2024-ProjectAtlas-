import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngLiteral, Marker, marker, Tooltip } from 'leaflet';
import { ufoIcon, unicornIcon } from '../assets/marker/markerSVG';

const UfoMarker = (props: any) => {
    const map = useMap();

    // UFOの移動範囲を設定
    const latMin = 34.55952;
    const latMax = 34.55942;
    const lngMin = 135.48521;
    const lngMax = 135.48521;

    // UFOの初期位置を設定
    const [ufoPosition, setUfoPosition] = useState<LatLngLiteral>({ lat: 34.38097037919402, lng: 135.26791339701882 });
    // UFOがクリックされたかどうかの状態を管理
    const [isUfo, setIsUfo] = useState(false);


    // UFOを動かす
    useEffect(() => {
        const moveUfo = setInterval(() => {
            if (!props.isMoving || isUfo) {
                setUfoPosition({
                    lat: 34.38097037919402,
                    lng: 135.26791339701882
                });
            } else {
                setUfoPosition({
                    lat: Math.random() * (latMax - latMin) + latMin,
                    lng: Math.random() * (lngMax - lngMin) + lngMin,
                });
            }
        }, 1000); // 1秒ごとに位置を更新

        return () => clearInterval(moveUfo);
    }, [props.isMoving, isUfo]);

    // UFOの位置をマップに反映させる
    useEffect(() => {
        const ufoMarker = marker(
            ufoPosition,
            { icon: ufoIcon, pane: 'ufo' }
        ).addTo(map);
        ufoMarker.on('click', handleUfoClick);
        return () => {
            map.removeLayer(ufoMarker);
        };
    }, [ufoPosition, map]);

    const handleUfoClick = () => {
        if (props.isMoving && !isUfo) {
            props.handOverFanFun(512810410); // コイニハッテンシテ
            setIsUfo(true);
            props.setEncounteredUfo(true); // 親コンポーネントにUFO遭遇フラグを渡す
        } else {
            console.log('オィイイイイイッス！ 今日はオフ会当日ですけども 参加者は 誰一人いませんでした');
        }
    };

    return null; // このコンポーネントはビジュアル要素を直接レンダリングしない
};

export default UfoMarker;