import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Marker, marker, divIcon} from 'leaflet';

const centerMapCenterCrosshair = ({ isMoving }: { isMoving: boolean }) => {
  const centerMap = useMap();
  const [crosshair, setCrosshair] = useState<Marker | null>(null);

  useEffect(() => {
    if (!crosshair) {
      // 照準のアイコンを作成
      const crosshairIcon = divIcon({
        className: 'custom-crosshair', // カスタムスタイルを適用するためのクラス名
        html: '<div style="width: 20px; height: 20px; border: 2px solid red; position: absolute; left: -10px; top: -10px; transform: translate(-50%, -250%);"></div>', // 照準のHTML
        iconSize: [20, 20], // アイコンのサイズ
        iconAnchor: [10, 10], // アイコンのアンカーポイント
      });

      // 地図の中心に照準を配置
      const centerMarker = marker(centerMap.getCenter(), { icon: crosshairIcon }).addTo(centerMap);
      setCrosshair(centerMarker);
    }

    if (isMoving) {
      // 移動中は照準を非表示
      crosshair && crosshair.remove();
    } else {
      // 移動していない場合は照準を表示
      crosshair && crosshair.addTo(centerMap).setLatLng(centerMap.getCenter());
    }

    // 地図の中心が変更されたときに照準の位置を更新
    centerMap.on('move', () => {
      crosshair && crosshair.setLatLng(centerMap.getCenter());
    });

    return () => {
      // コンポーネントがアンマウントされたときに照準を削除
      crosshair && crosshair.remove();
    //   centerMap.off('move');
    };
  }, [isMoving, crosshair, centerMap]);

  return null;
};

export default centerMapCenterCrosshair;