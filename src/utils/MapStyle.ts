import { StyleFunction, LatLngExpression, circleMarker, divIcon, marker } from 'leaflet';
import { svgBuil } from '../assets/marker/markerSVG.ts'

const circleMarkerOptions = {
    radius: 10,
    fillColor: 'white',
    color: 'red',
    weight: 2,
    fillOpacity: 1,
};

// pointデータを図形として表現
export const pointToLayer = (feature: any, latlng: LatLngExpression) => {
    const builIcon = divIcon({
        className: 'buil-icon', // カスタムクラス名
        html: svgBuil,  // ここに車のアイコンを挿入する
        iconSize: [50, 50], // アイコンのサイズ
        iconAnchor: [25, 25] // アイコンのアンカーポイント
    });
    // const marker = circleMarker(latlng, circleMarkerOptions);
    const builMarker = marker(latlng, { icon: builIcon, opacity: 1 })
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

// pointデータを図形として表現
export const showDetail = (feature: any, latlng: LatLngExpression) => {
    const builIcon = divIcon({
        className: 'buil-icon', // カスタムクラス名
        html: svgBuil,  // ここにビルのアイコンを挿入する
        iconSize: [50, 50], // アイコンのサイズ
        iconAnchor: [25, 25] // アイコンのアンカーポイント
    });
    // const marker = circleMarker(latlng, circleMarkerOptions);
    const builMarker = marker(latlng, { icon: builIcon, opacity: 1 })
    // ホバー時のイベントハンドラ
    const onHover = (e: L.LeafletMouseEvent) => {
        const hoveredMarker = e.target;
        console.log(feature)
        // ツールチップ表示
        hoveredMarker.bindTooltip(feature.properties.event_place, { permanent: true, direction: 'top' }).openTooltip();
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
export const overlayStyle: StyleFunction = (feature) => {
    return{
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

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function addHexColors(hex1: string, hex2: string): string {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    let r = Math.min(rgb1.r + rgb2.r, 255);
    let g = Math.min(rgb1.g + rgb2.g, 255);
    let b = Math.min(rgb1.b + rgb2.b, 255);

    return rgbToHex(r, g, b);
}

// 日本の天気
export const polygonStyle = (season: number, time: number, weather: number) => {
    // console.log(season, time, weather)
    let seasonColor = '';
    let timeColor = '';
    let weatherColor = '';
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
            timeColor = '#d4ceca'; // 淡い青緑
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
            timeColor = '#001e43'; // ミッドナイトブルー
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
        fillOpacity: 0.4,
    };
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