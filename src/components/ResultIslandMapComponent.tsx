import '../styles/Result.css';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import areas from '../assets/jsons/map_data/area.json'
import { mapStyle} from '../utils/MapStyle.ts'
import { LatLngLiteral, MaplibreGL, point, divIcon, marker } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { mapStylePathWay } from '../utils/MapStyle.ts'
import { emojiStart, emojiGoal } from '../assets/marker/markerSVG.ts'

export const ResultIslandMapComponent = (props: any) => {
    const mapZoom = 9.2;
    const mapCenter:LatLngLiteral = {lat:34.650003221419524, lng:135.53905226930204}

    const OSMlayerRef = useRef<MaplibreGL | null>(null);
    const isInitMapRef = useRef<Boolean>(true);
    const [isMapReady, setIsMapReady] = useState(false);

    // 通る道についての描画
    const PathWay: React.FC = () => {
        if (props.pathway) {
            const geojson = {
                type: "FeatureCollection",
                features: props.pathway
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

    const StartPosition = () =>{
        const map = useMap()
        const crtLat:number = props.pathway[0].geometry.coordinates[0][0][1]
        const crtLng:number = props.pathway[0].geometry.coordinates[0][0][0]
        const markerSVG: string = emojiStart
        const markerClass: string = "icon-goal"
        const markerSize: [number, number] = [50, 50]
        const markerAnchor: [number, number] = [8, 38]
        // L.icon を使用してカスタムアイコンを設定
        const noteIcon = divIcon({
            className: markerClass, // カスタムクラス名
            html: markerSVG, // SVG アイコンの HTML
            iconSize: markerSize, // アイコンのサイズ
            iconAnchor: markerAnchor // アイコンのアンカーポイント
            });
        const lyricMarker = marker([crtLat, crtLng], { icon: noteIcon, opacity: 1}).addTo(map);
        // 時間に応じたクラスを追加したツールチップを追加
        lyricMarker.bindTooltip("aaa", 
            { permanent: true, direction: 'center', interactive: true, offset: point(30, 0), className: "label-note"})
            .closeTooltip();
        return null;
    }

    const EndPosition = () =>{
        const map = useMap()
        const coordinates = props.pathway[0].geometry.coordinates[0]
        const coordinatesLength = coordinates.length
        const crtLat:number = coordinates[coordinatesLength-1][1]
        const crtLng:number = coordinates[coordinatesLength-1][0]
        const markerSVG: string = emojiGoal
        const markerClass: string = "icon-goal"
        const markerSize: [number, number] = [50, 50]
        const markerAnchor: [number, number] = [8, 38]
        // L.icon を使用してカスタムアイコンを設定
        const noteIcon = divIcon({
            className: markerClass, // カスタムクラス名
            html: markerSVG, // SVG アイコンの HTML
            iconSize: markerSize, // アイコンのサイズ
            iconAnchor: markerAnchor // アイコンのアンカーポイント
            });
        const lyricMarker = marker([crtLat, crtLng], { icon: noteIcon, opacity: 1}).addTo(map);
        // 時間に応じたクラスを追加したツールチップを追加
        lyricMarker.bindTooltip("aaa", 
            { permanent: true, direction: 'center', interactive: true, offset: point(30, 0), className: "label-note"})
            .closeTooltip();
        return null;
    }

    // MapLibreTileLayerのrefを定期監視する処理
    useEffect(() => {
        if (!isInitMapRef.current){
            return
        }
        const interval = setInterval(() => {
            console.log("checking")
            if (OSMlayerRef.current) {
                if (OSMlayerRef.current.getMaplibreMap().getStyle()){
                    console.log(OSMlayerRef.current)
                    setIsMapReady(true);
                    clearInterval(interval);
                }
            }
        }, 10);
        return () => clearInterval(interval);
    }, []);
    // MapLibraTileLayerのrefがnullから変化した場合に行う処理
    useEffect(() => {
        if (!isInitMapRef.current || !OSMlayerRef.current) {
            return
        }
        if (OSMlayerRef.current.getMaplibreMap().getStyle()){
            const osmMap = OSMlayerRef.current.getMaplibreMap();
            // ここでスタイルを変更
            osmMap.getStyle().layers.forEach((l: any) => {
              if (l.type === "symbol") osmMap.setLayoutProperty(l.id, "visibility", "none"); // 文字を消す
              // 水の色を変更
              if (["waterway", "water"].includes(l.id) && l.type === "fill") {
                osmMap.setPaintProperty(l.id, "fill-color", "#90dbee");
              }
              // 道路の色を変更
              if (l["source-layer"] === "transportation" && l.type === "line") {
                osmMap.setPaintProperty(l.id, "line-color", "#8995a2");
              }
            });
            isInitMapRef.current = false
        }
    }, [isMapReady]);

    return(
        <MapContainer className='mapcomponent' style={{ backgroundColor: '#f5f3f3' }}
            center={mapCenter} zoom={mapZoom}
            minZoom={mapZoom} maxZoom={mapZoom}
            zoomSnap={0.1} zoomDelta={0.5} trackResize={true}
            inertiaMaxSpeed={500} inertiaDeceleration={1000}
            zoomControl={false} attributionControl={false}
            maxBoundsViscosity={1.0}
            preferCanvas={true}
            boxZoom={false} doubleClickZoom={false}
            inertia={false} dragging={false}
            touchZoom={false} scrollWheelZoom={false}
            tap={false} keyboard={false}
        >
        <PathWay />
        <StartPosition/>
        <EndPosition/>
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/stamen_terrain.json" // https://docs.stadiamaps.com/map-styles/osm-bright/ より取得
          ref={OSMlayerRef}
          style={{ name: "Stadia Maps", version: 8, sources: {}, layers: [] }}
        />
        <GeoJSON
          data={areas as GeoJSON.GeoJsonObject}
          style={mapStyle}
        />
      </MapContainer>
    )
}