declare module '*/map_data/*.json' {
    type Coordinate = {
      0: number; // longitude
      1: number; // latitude
    }
  
    type Geometry = {
      type: "MultiLineString";
      coordinates: Coordinate[][];
    } |       {type: "PathWay";
    coordinates: Coordinate[][];
  } |{
      type : "Point";
      coordinates: Coordinate[];
    }
  
    type Properties = {
      type: number;
      name: string;
    }
  
    type Feature = {
      type: "Feature";
      properties: Properties;
      geometry: Geometry;
    }

    type Data = {
      type: "FeatureCollection";
      features: Feature[];
    }
  
    const value: Data;
    export = value;
  }

  type Ahead = {
    unit_vector: Vector // 地図における頭の向き
    distance_km: number // その向きでいる距離
}