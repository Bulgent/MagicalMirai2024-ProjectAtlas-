import { StyleFunction, LatLngExpression,  divIcon, marker, Marker, PathOptions } from 'leaflet';
import { emojiSight } from '../assets/marker/markerSVG.ts'

// pointデータを図形として表現(固定式観光地)
export const pointToLayer = (feature: any, latlng: LatLngExpression): Marker => {
    const builIcon = divIcon({
        className: 'buil-icon', // カスタムクラス名
        html: emojiSight[emojiSight.length - 1],  // ここに車のアイコンを挿入する
        iconSize: [50, 50], // アイコンのサイズ
        iconAnchor: [25, 25] // アイコンのアンカーポイント
    });
    // const marker = circleMarker(latlng, circleMarkerOptions);
    const builMarker = marker(latlng, { icon: builIcon, opacity: 1 })
    // featureプロパティを利用してマーカーにデータを設定
    // ホバー時のイベントハンドラ
    const onHover = (e: L.LeafletMouseEvent) => {
        const hoveredMarker = e.target;
        //   hoveredMarker.setStyle({
        //     fillColor: 'yellow', // ホバー時の色
        //   });
        // ツールチップ表示
        hoveredMarker.bindTooltip(feature.properties.name, { permanent: true, direction: 'top' }).openTooltip();
    };

    // ホバーが解除された時のイベントハンドラ
    // const onHoverOut = (e: L.LeafletMouseEvent) => {
    //   const hoveredMarker = e.target;
    //   hoveredMarker.setStyle(circleMarkerOptions); // 元のスタイルに戻す
    // };

    // イベントリスナーを追加
    builMarker.on('mouseover', onHover);
    // marker.on('mouseout', onHoverOut);
    return builMarker;
};

// pointデータを図形として表現(移動式観光地)
export const showDetail = (feature: any, latlng: LatLngExpression): Marker => {
    // console.log(latlng, feature)
    const builIcon = divIcon({
        className: 'buil-icon', // カスタムクラス名
        html: emojiSight[feature.properties.event_type],  // ここにビルのアイコンを挿入する
        iconSize: [50, 50], // アイコンのサイズ
        iconAnchor: [25, 25], // アイコンのアンカーポイント
    });
    // const marker = circleMarker(latlng, circleMarkerOptions);
    const builMarker = marker(latlng, { icon: builIcon, opacity: 1, pane: "waypoint" })
    // ホバー時のイベントハンドラ
    const onHover = (e: L.LeafletMouseEvent) => {
        const hoveredMarker = e.target;
        // console.log(feature)
        // ツールチップ表示
        hoveredMarker.bindTooltip(feature.properties.event_place, { permanent: true, direction: 'top' , className: 'sightseeing-tooltip'}).openTooltip();
    };

    // ホバーが解除された時のイベントハンドラ
    // const onHoverOut = (e: L.LeafletMouseEvent) => {
    //   const hoveredMarker = e.target;
    //   // ツールチップ閉じる
    //   hoveredMarker.unbindTooltip();
    // };

    // イベントリスナーを追加
    builMarker.on('mouseover', onHover);
    // builMarker.on('mouseout', onHoverOut);
    return builMarker;
};

/**
 * リザルト画面用のアイコンのスタイル
 * pane不要のため新たに設定
 */
export const visitedPointsStyle = (feature: any, latlng: LatLngExpression): Marker => {
    // console.log(latlng, feature)
    const builIcon = divIcon({
        className: 'buil-icon', // カスタムクラス名
        html: emojiSight[feature.properties.event_type],  // ここにビルのアイコンを挿入する
        iconSize: [50, 50], // アイコンのサイズ
        iconAnchor: [25, 25], // アイコンのアンカーポイント
    });
    // const marker = circleMarker(latlng, circleMarkerOptions);
    const builMarker = marker(latlng, { icon: builIcon, opacity: 1})
    // ホバー時のイベントハンドラ
    const onHover = (e: L.LeafletMouseEvent) => {
        const hoveredMarker = e.target;
        // console.log(feature)
        // ツールチップ表示
        hoveredMarker.bindTooltip(feature.properties.event_place +
             ' (+' + feature.properties.fanfun_score + 'FF)',
              { permanent: true, direction: 'top' , className: 'sightseeing-tooltip'}).openTooltip();
    };

    // ホバーが解除された時のイベントハンドラ
    const onHoverOut = (e: L.LeafletMouseEvent) => {
      const hoveredMarker = e.target;
      // ツールチップ閉じる
      hoveredMarker.unbindTooltip();
    };

    // イベントリスナーを追加
    builMarker.on('mouseover', onHover);
    builMarker.on('mouseout', onHoverOut);
    return builMarker;
};

// line, polygonデータを図形として表現
export const mapStyle: StyleFunction = (feature): PathOptions => {
    switch (feature?.geometry?.type) {
        case 'MultiLineString':
            return {
                color: '#99abc2',
                weight: 10,
            };
        case 'MultiPolygon':
            return {
                fillColor: '#90dbee', // 海の色
                weight: 2,
                opacity: 0.5,
                color: '#90dbee',
                fillOpacity: 1,
            };
        default:
            return {};
    }
};

// line, polygonデータを図形として表現
/* @ts-ignore */
export const overlayStyle: StyleFunction = (feature): PathOptions => {
    return {
        fillColor: 'white',
    }
};

export const enum weatherType {
    SUNNY = 0,
    CLOUDY = 1,
    RAINY = 2,
    SNOWY = 3,
    OTHER = 4
}
export const enum timeType {
    MORNING = 0,
    NOON = 1,
    AFTERNOON = 2,
    SUNSET = 3,
    NIGHT = 4,
    OTHER = 5
}
export const enum seasonType {
    SPRING = 0,
    SUMMER = 1,
    AUTUMN = 2,
    WINTER = 3,
    OTHER = 4
}

// function hexToRgb(hex: string): { r: number; g: number; b: number } {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);
//     return { r, g, b };
// }

// function rgbToHex(r: number, g: number, b: number): string {
//     const toHex = (c: number) => {
//         const hex = c.toString(16);
//         return hex.length == 1 ? "0" + hex : hex;
//     };
//     return "#" + toHex(r) + toHex(g) + toHex(b);
// }


// function addHexColors(hex1: string, hex2: string): string {
//     const rgb1 = hexToRgb(hex1);
//     const rgb2 = hexToRgb(hex2);

//     let r = Math.min(rgb1.r + rgb2.r, 255);
//     let g = Math.min(rgb1.g + rgb2.g, 255);
//     let b = Math.min(rgb1.b + rgb2.b, 255);

//     return rgbToHex(r, g, b);
// }

// 日本の天気
export const polygonStyle = (season: number, time: number, weather: number, opacity: number): PathOptions => {
    // console.log(season, time, weather)
    /* @ts-ignore */
    let seasonColor = '';
    /* @ts-ignore */
    let timeColor = '';
    /* @ts-ignore */
    let weatherColor = '';
    /* @ts-ignore */
    let color = '';
    switch (season) {
        case seasonType.SPRING:
            seasonColor = '#fef4f4'; // 桜色
            break;
        case seasonType.SUMMER:
            seasonColor = '#38a1db'; // 露草色
            break;
        case seasonType.AUTUMN:
            seasonColor = '#ed6d3d'; // 柿色
            break;
        case seasonType.WINTER:
            seasonColor = '#afafb0'; // 銀鼠
            break;
        default:
            seasonColor = '#ffffff'; // 白色
            break;
    }
    switch (time) {
        case timeType.MORNING:
            timeColor = '#CFE0E8'; // 淡い青緑
            break;
        case timeType.NOON:
            timeColor = '#ffffff'; // 太陽色
            break;
        case timeType.AFTERNOON:
            timeColor = '#ffffff'; // 空色
            break;
        case timeType.SUNSET:
            timeColor = '#ec5d0f'; // 夕日色
            break;
        case timeType.NIGHT:
            timeColor = '#5078A0'; // ミッドナイトブルー
            break;
        default:
            timeColor = '#ffffff'; // 白色
            break;
    }
    switch (weather) {
        case weatherType.SUNNY:
            weatherColor = '#ffcc00'; // 太陽色
            break;
        case weatherType.CLOUDY:
            weatherColor = '#ff6600'; // 雲色
            break;
        case weatherType.RAINY:
            weatherColor = '#ff9933'; // 雨色
            break;
        case weatherType.SNOWY:
            weatherColor = '#0099cc'; // 雪色
            break;
        default:
            weatherColor = '#ffffff'; // 白色
            break;
    }
    // color = addHexColors(seasonColor, timeColor);
    // color = addHexColors(color, weatherColor);
    color = timeColor
    return {
        fillColor: color,
        fillOpacity: opacity,
    };
};

// line, polygonデータを図形として表現
export const mapStylePathWay: StyleFunction = (feature): PathOptions => {
    switch (feature?.geometry?.type) {
        case 'MultiLineString':
            return {
                color: '#2f79dc',
                weight: 5,
                opacity: 1,
            };
        default:
            return {};
    }
};