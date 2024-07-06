import '../styles/Result.css';
import { MapContainer, GeoJSON, useMap, Marker } from 'react-leaflet';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import areas from '../assets/jsons/map_data/area.json'
import { mapStyle} from '../utils/MapStyle.ts'
import { LatLngLiteral, MaplibreGL } from 'leaflet';
import { useEffect, useRef } from 'react';

export const ResultMapComponent = (props: any) => {
    const mapZoom = 10.2;
    const mapCenter:LatLngLiteral = {lat:34.6379271092576, lng:135.4196972135114}
    // OpenStreetMapレイヤー
    const OSMlayerRef = useRef<MaplibreGL | null>(null);
    const isInitMapRef = useRef<Boolean>(true);
  /**
   * Mapから文字を消す処理  
   */
    useEffect(() => {
        console.log(OSMlayerRef.current)
        if (!isInitMapRef.current) {
        return
        }
        if (OSMlayerRef.current) {
        // 読み込みが2段階ある
        if (OSMlayerRef.current.getMaplibreMap().getStyle() === undefined) {
          return
        }
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
    }, [OSMlayerRef.current]);

    // リサイズ時に地図を再描画
    useEffect(() => {
      const handleResize = () => {
          if (OSMlayerRef.current) {
              OSMlayerRef.current.resize();
          }
      };
  
      window.addEventListener('resize', handleResize);
  
      // コンポーネントのアンマウント時にイベントリスナーを削除
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []); // 空の依存配列を指定して、コンポーネントのマウント時にのみ実行


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