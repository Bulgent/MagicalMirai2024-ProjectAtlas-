import {aStar} from 'ngraph.path';
import createGraph from 'ngraph.graph';
import roads from './map_data/roads.json';

/*
    feature_index_1とfeature_index_2は互いに行き来可能
    feature_index_1とfeature_index_2は文字列ではなく、数値のインデックスを使用する
*/
type Link = {
    from: [number, number]; // feature_index_1
    to: [number, number]; // feature_index_2
    from_string:string; // `${from[0]}-${from[1]}` 
    to_string:string; // `${to[0]}-${to[1]}` 
    weight: number;
    link_id: string;
    json_index:number;
    type:number;
    name:string;
}

const deg2rad = (deg: number): number => {
    return (deg * Math.PI) / 180.0;
  };

/*
緯度経度から距離kmに変換
*/
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

/*
任意の小数点の桁（scale）で四捨五入
*/
const roundWithScale = (value: number, scale: number) => {
  return Math.round(value * 10 ** scale) / 10 ** scale;
};

/*
jsonから最短距離計算のためのLinkへの整形
*/
const createLinksFromJsonKai = (json: any):Link[] =>{
  const links: Link[] = [];
  const features = json["features"];
  // それぞれのノードの一致度の正確さを決定
  // 値が大きいとより正確な一致度を計算する（完全一致である必要があるため、高すぎると計算してくれない）
  const position_accuracy = 3
  for (let feature of features){
      let {properties, geometry } = feature;
      let { name, type } = properties;
      // それぞれの道路について、2点毎にリンクを作成する[a, b, c, d] -> [a,b], [b, c], [c, d]
      const coordinates = geometry.coordinates[0]
      for (let i=0; i<= coordinates.length-2; i++){
        // 一方の点ともう一方の点の描画する座標を取得
        let from_lonlat:[number,number] = [coordinates[i][0], coordinates[i][1]]
        let to_lonlat:[number,number] = [coordinates[i+1][0], coordinates[i+1][1]]
        // 最短距離計算に使用するためのid（この文字列が一致しているノードは同じ座標にあると判断する）
        const from_string : string = `${roundWithScale(from_lonlat[0],position_accuracy)}-${roundWithScale(from_lonlat[1],position_accuracy)}`
        const to_string : string = `${roundWithScale(to_lonlat[0],position_accuracy)}-${roundWithScale(to_lonlat[1],position_accuracy)}`
        // 計算結果をもとに再描画する際のために、情報は多めに格納しておく（こうすることでjsonから改めてデータを持ってくることを防ぐ）
        let link: Link = {
          from: from_lonlat,
          to: to_lonlat,
          from_string,
          to_string,
          weight: calculateDistance(from_lonlat, to_lonlat),
          link_id: `${from_string}-${to_string}`,
          json_index: i,
          type,
          name
        }
        links.push(link);
      }
    }
  return links
}

function getFeatureByLinkIdKai(linkid:string[], links:Link[]):any[]{
  const feature_ret = []
  for (let link_id_ of linkid){
    const targetIndex2 = links.findIndex(link => {
      return link.link_id === link_id_
    });
    const link_detail:Link = links[targetIndex2]
    const {from, to, type, name} = link_detail
    const feature = {
      type: "Feature",
      properties: {
        type,
        name,
      },
      geometry:{
        type:"MultiLineString",
        coordinates:[
          [
            from,
            to
          ]
        ]
      }
    }
    feature_ret.push(feature)
  }
  return feature_ret
}

export function computePath(): any[] {
  
  // jsonからのデータ成形
  const links = createLinksFromJsonKai(roads)
  const start_id = links[3000].from_string
  const end_id = links[3500].from_string
  // リンクを格納して計算準備
  const graph = createGraph();
  for (const link of links){
    const {from_string, to_string, weight} = link
    graph.addLink(from_string, to_string, { weight })
  }
  const pathFinder = aStar(graph, {
    // oriented: true,
    // We tell our pathfinder what should it use as a distance function:
    distance(fromNode, toNode, link) {
      // We don't really care about from/to nodes in this case,
      // as link.data has all needed information:
      return link.data.weight;0
    }
  });
  // 計算を実施
  const path_lst = pathFinder.find(start_id, end_id);
  // 計算結果よりリンクidを取得（描画用の座標に変換するため）
  const path_links:string[] = []
  for (const path:any of path_lst){
    const links_array = [...path.links]
    path_links.push(`${links_array[0].fromId}-${links_array[0].toId}`)
    path_links.push(`${links_array[1].fromId}-${links_array[1].toId}`)
  }
  // 描画用の座標をfeaturesに格納
  return getFeatureByLinkIdKai(path_links, links)
}