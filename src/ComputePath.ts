import {aStar} from 'ngraph.path';
import createGraph from 'ngraph.graph';
import roads from './map_data/roads.json';

/*
    feature_index_1とfeature_index_2は互いに行き来可能
    feature_index_1とfeature_index_2は文字列ではなく、数値のインデックスを使用する
*/
type RoadNode = {
    from: [number, number]; // feature_index_1
    to: [number, number]; // feature_index_2
    from_string:string; // `${from[0]}-${from[1]}` 
    to_string:string; // `${to[0]}-${to[1]}` 
    weight: number;
    type:number;
    name:string;
}

const deg2rad = (deg: number): number => {
    return (deg * Math.PI) / 180.0;
  };

const calculateDistance = (from_lonlat: [number, number], to_lonlat:[number, number]):number =>{
    const RX: number = 6378.137; // 回転楕円体の長半径（赤道半径）[km]
    const RY: number = 6356.752; // 回転楕円体の短半径（極半径) [km]
    const dx = deg2rad(from_lonlat[0]) - deg2rad(to_lonlat[0]);
    const dy = deg2rad(from_lonlat[1]) - deg2rad(to_lonlat[1]);
    const mu = (deg2rad(from_lonlat[1]) + deg2rad(to_lonlat[1])) / 2.0; // μ
    const E = Math.sqrt(1 - Math.pow(RY / RX, 2.0)); // 離心率
    const W = Math.sqrt(1 - Math.pow(E * Math.sin(mu), 2.0));
    const M = RX * (1 - Math.pow(E, 2.0)) / Math.pow(W, 3.0); // 子午線曲率半径
    const N = RX / W; // 卯酉線曲率半径
    return Math.sqrt(Math.pow(M * dy, 2.0) + Math.pow(N * dx * Math.cos(mu), 2.0)); // 距離[km]
}

// road.jsonを全てノードで表す
const createLinksFromJson = (dict: any):RoadNode[] =>{
    let road_nodes: RoadNode[] = [];
    const features = roads["features"];
    for (const feature of features){
        const {properties, geometry } = feature;
        const { name, type } = properties;
        const from_lonlat:[number,number] = [geometry.coordinates[0][0][0], geometry.coordinates[0][0][1]]
        const to_lonlat:[number,number] = [geometry.coordinates[0].slice(-1)[0][0], geometry.coordinates[0].slice(-1)[0][1]]

        const road_node: RoadNode = {
            from: from_lonlat,
            to: to_lonlat,
            from_string: `${from_lonlat[0]}-${from_lonlat[1]}` ,
            to_string: `${to_lonlat[0]}-${to_lonlat[1]}` ,
            weight: calculateDistance(from_lonlat, to_lonlat),
            type,
            name
        }
      road_nodes.push(road_node);
    }
    return road_nodes
}

export function foo(): void {
  const links = createLinksFromJson(roads)
  const graph = createGraph();
  for (const link of links){
    const {from_string, to_string, weight} = link
    graph.addLink(from_string, to_string, { weight })
  }

  const pathFinder = aStar(graph, {
    // We tell our pathfinder what should it use as a distance function:
    distance(fromNode, toNode, link) {
      // We don't really care about from/to nodes in this case,
      // as link.data has all needed information:
      return link.data.weight;
    }
  });
  const path = pathFinder.find(links[0].from_string, links[100].to_string);

  console.log(path);
}