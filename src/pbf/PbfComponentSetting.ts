import { createTileLayerComponent, LayerProps, updateGridLayer } from '@react-leaflet/core';
import L, { TileLayer as LeafletTileLayer, TileLayerOptions } from 'leaflet';
import 'leaflet.vectorgrid';

export interface PbfLayerProps extends TileLayerOptions, LayerProps {
  url: string;
  vectorTileLayerStyles?: { [key: string]: L.PathOptions | L.PolylineOptions };
}

const PbfLayer = createTileLayerComponent<LeafletTileLayer, PbfLayerProps>(
  function createPbfLayer({ url, vectorTileLayerStyles, ...options }, context) {

    return {
      instance: new (L as any).vectorGrid.protobuf(url, {
        rendererFactory: L.canvas.tile,
        // rendererFactory: L.svg.tile,
        vectorTileLayerStyles,
        ...options,
      }),
      context,
    };
  },updateGridLayer);

export default PbfLayer;