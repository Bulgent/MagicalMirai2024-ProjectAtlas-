import { StyleFunction, LatLngExpression, circleMarker } from 'leaflet';

// pointデータを図形として表現
export const pointToLayer = (feature: any, latlng: LatLngExpression) => {
    const circleMarkerOptions = {
        radius: 6,
        fillColor: 'white',
        color: 'red',
        weight: 2,
        fillOpacity: 1,
    };
    return circleMarker(latlng, circleMarkerOptions);
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