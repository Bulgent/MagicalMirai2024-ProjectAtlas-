import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Marker, marker, divIcon, LatLngLiteral } from 'leaflet';
import { mapCross } from '../assets/marker/markerSVG';

const centerMapCenterCrosshair = ({ isMoving, mapCenter, pane }: { isMoving: boolean, mapCenter: LatLngLiteral, pane: string }) => {
  const centerMap = useMap();
  const [crosshair, setCrosshair] = useState<Marker | null>(null);

  useEffect(() => {
    if (!crosshair) {
      // 照準のアイコンを作成
      const crosshairIcon = divIcon({
        className: 'custom-crosshair', // カスタムスタイルを適用するためのクラス名
        html: mapCross,
        iconSize: [50, 50], // アイコンのサイズ
        iconAnchor: [25, 35], // アイコンのアンカーポイント
      });

      // 地図の中心に照準を配置
      const centerMarker = marker(
        [
          centerMap.getCenter().lat - mapCenter.lat,
          centerMap.getCenter().lng - mapCenter.lng
        ],
        { icon: crosshairIcon }
      ).addTo(centerMap);
      setCrosshair(centerMarker);
    }

    if (isMoving) {
      // 移動中は照準を非表示
      crosshair && crosshair.remove();
    } else {
      // 移動していない場合は照準を表示
      crosshair && crosshair.addTo(centerMap).setLatLng(
        [
          centerMap.getCenter().lat - mapCenter.lat,
          centerMap.getCenter().lng - mapCenter.lng
        ]
      );
    }

    // 地図の中心が変更されたときに照準の位置を更新
    centerMap.on('move', () => {
      crosshair && crosshair.setLatLng(
        [
          centerMap.getCenter().lat - mapCenter.lat,
          centerMap.getCenter().lng - mapCenter.lng
        ]
      );
    });

    return () => {
      // コンポーネントがアンマウントされたときに照準を削除
      crosshair && crosshair.remove();
      // centerMap.off('move');
    };
  }, [isMoving, crosshair, centerMap]);

  return null;
};

export default centerMapCenterCrosshair;