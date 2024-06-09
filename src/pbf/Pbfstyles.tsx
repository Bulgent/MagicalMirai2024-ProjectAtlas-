export interface VectorTileLayerStyles {
    [key: string]: {
        color: string;
        opacity: number;
        weight: number;
        fill?: boolean;
        fillColor?: string;
        fillOpacity?: number;
    };
}

export const vectorTileLayerStyles = {
    "lake": {
      color: "#90dbee",
      opacity: 1,
      weight: 0.5,
      fill: true,
      fillColor: "#90dbee",
      fillOpacity: 1,
    },
    "waterarea": {
      color: "#90dbee",
      opacity: 1,
      weight: 0.5,
      fill: true,
      fillColor: "#90dbee",
      fillOpacity: 1,
    },
    "river": {
      color: "#90dbee",
      opacity: 1,
      weight: 0.5
    },
    "building": {
      color: "#9d9da0",
      opacity: 1,
      weight: 0.5,
      fill: true,
      fillColor: "#e8e9ed",
      fillOpacity: 1,
    },
    "road": {
      color: "#b5c5d3",
      opacity: 0,
      weight: 0.5,
    },

    // ここから下は多分いらない（見えないようにopacity:0）
    "coastline": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "wstructurea": {
      color: "red",
      opacity: 1,
      weight: 0.5,
      fill: true,
      fillColor: "#red",
      fillOpacity: 1,
    },
    "structurel": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "landforma": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "transp": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "label": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "elevation": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "contour": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "landforml": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "boundary": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "searoute": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "symbol": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "structurea": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "landformp": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
    "railway": {
      color: "red",
      opacity: 0,
      weight: 0.5
    },
  }