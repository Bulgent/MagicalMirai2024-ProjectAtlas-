import { MapContainer, GeoJSON, useMap, Marker } from 'react-leaflet';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'
import areas from '../assets/jsons/map_data/area.json'
import { mapStyle} from '../utils/MapStyle.ts'
import { LatLngLiteral } from 'leaflet';

export const MapComponent = (props: any) => {
    const mapZoom = 10.2;
    const mapCenter:LatLngLiteral = {lat:34.6379271092576, lng:135.4196972135114}

    return(
        <MapContainer className='mapcomponent' style={{ backgroundColor: '#f5f3f3' }}
        center={mapCenter} zoom={mapZoom}
        minZoom={mapZoom} maxZoom={mapZoom}
        zoomSnap={0.1} zoomDelta={0.5} trackResize={false}
        inertiaMaxSpeed={500} inertiaDeceleration={1000}
        zoomControl={false} attributionControl={false}
        maxBoundsViscosity={1.0}
        preferCanvas={true}
        boxZoom={false} doubleClickZoom={false}
        inertia={false} dragging={false}
      >
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/stamen_terrain.json" // https://docs.stadiamaps.com/map-styles/osm-bright/ より取得
        //   ref={OSMlayerRef}
          style={{ name: "Stadia Maps", version: 8, sources: {}, layers: [] }}
        />
        <GeoJSON
          data={areas as GeoJSON.GeoJsonObject}
          style={mapStyle}
        />
      </MapContainer>
    )
}