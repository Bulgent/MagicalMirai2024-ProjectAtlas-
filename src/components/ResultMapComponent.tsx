import { MapContainer, GeoJSON, useMap, Marker } from 'react-leaflet';
import { MapLibreTileLayer } from '../utils/MapLibraTileLayer.ts'

export const MapComponent = (props: any) => {
    const mapZoom = 15;

    return(
        <MapContainer className='mapcomponent' style={{ backgroundColor: '#f5f3f3' }}
        center={[-1, -1]} zoom={mapZoom}
        minZoom={14} maxZoom={17}
        zoomSnap={0.1} zoomDelta={0.5} trackResize={false}
        inertiaMaxSpeed={500} inertiaDeceleration={1000}
        zoomControl={false} attributionControl={false}
        maxBoundsViscosity={1.0}
        preferCanvas={true}
        boxZoom={false} doubleClickZoom={false}
        inertia={false}
      >
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/stamen_terrain.json" // https://docs.stadiamaps.com/map-styles/osm-bright/ より取得
        //   ref={OSMlayerRef}
          style={{ name: "Stadia Maps", version: 8, sources: {}, layers: [] }}
        />
      </MapContainer>
    )
}