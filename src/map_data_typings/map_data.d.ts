declare module '*/map_data/*.json' {
    type Coordinate = {
      0: number; // longitude
      1: number; // latitude
    }
  
    type Geometry = {
      type: "MultiLineString";
      coordinates: Coordinate[][];
    } | {
      type : "Point";
      coordinates: Coordinate[];
    }
  
    type Properties = {
      type: number;
      name: string;
    }
  
    type Data = {
      properties: Properties;
      geometry: Geometry;
    }
  
    const value: Data[];
    export = value;
  }