import { StyleFunction, LatLngExpression, circleMarker } from 'leaflet';

// pointデータを図形として表現
export const pointToLayer = (feature: any, latlng: LatLngExpression) => {
    const circleMarkerOptions = {
        radius: 10,
        fillColor: 'white',
        color: 'red',
        weight: 2,
        fillOpacity: 1,
    };
    const marker = L.circleMarker(latlng, circleMarkerOptions);
  
    // ホバー時のイベントハンドラ
    const onHover = (e: L.LeafletMouseEvent) => {
      const hoveredMarker = e.target;
      hoveredMarker.setStyle({
        fillColor: 'yellow', // ホバー時の色
      });
      // ツールチップ表示
      hoveredMarker.bindTooltip(feature.properties.name, { permanent: true, direction: 'top' }).openTooltip();
      
    };
  
    // ホバーが解除された時のイベントハンドラ
    // const onHoverOut = (e: L.LeafletMouseEvent) => {
    //   const hoveredMarker = e.target;
    //   hoveredMarker.setStyle(circleMarkerOptions); // 元のスタイルに戻す
    // };
  
    // イベントリスナーを追加
    marker.on('mouseover', onHover);
    // marker.on('mouseout', onHoverOut);
  
    return marker;

};

// line, polygonデータを図形として表現
export const mapStyle: StyleFunction = (feature) => {
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
export const mapStylePathWay: StyleFunction = (feature) => {
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