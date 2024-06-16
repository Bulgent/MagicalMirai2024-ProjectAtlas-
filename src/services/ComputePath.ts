import {aStar} from 'ngraph.path';
import createGraph from 'ngraph.graph';
import roads from '../assets/jsons/map_data/trunk.json';
import { calculateDistance, roundWithScale } from '../utils/utils.ts'

/*
    feature_index_1とfeature_index_2は互いに行き来可能
    feature_index_1とfeature_index_2は文字列ではなく、数値のインデックスを使用する
*/
type Link = {
    from: [number, number]; // feature_index_1 [lon, lat]
    to: [number, number]; // feature_index_2
    from_string:string; // `${from[0]}-${from[1]}` 
    to_string:string; // `${to[0]}-${to[1]}` 
    weight: number;
    link_id: string;
    json_index:number;
    type:number;
    name:string;
}

type NodeResult = {
  node_id: string;
  link_id: string;
  link_position: "to"|"from";
}


/*
jsonから最短距離計算のためのLinkへの整形
*/
const createLinksFromJson = (json: any):Link[] =>{
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

function getFeature(node_results:NodeResult[], links:Link[]):[any[], any[], any[]]{
  const feature_ret = []
  const nodes_path:[number, number][] = []
  const nodes_path_json:[number, number][] = []

  for (let node_result of node_results){
    const targetIndex2 = links.findIndex(link => {
      return link.link_id === node_result.link_id
    });
    const link_detail:Link = links[targetIndex2]
    const {from, to, type, name} = link_detail

    // それぞれのリンク毎のfeatureを作成し配列に格納
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
    // それぞれのノードの値を取得し格納（リンクの片方のノードのみを格納）
    if (node_result.link_position==="from"){
      nodes_path_json.push([from[0], from[1]])
      nodes_path.push([from[1], from[0]])
    }else{
      nodes_path_json.push([to[0], to[1]])
      nodes_path.push([to[1], to[0]])
    }
  }
  const nodes_path_feature = [
    {
      type: "Feature",
      properties: {
        type:3,
        name:"pathway",
      },
      geometry:{
        type:"MultiLineString",
        coordinates:[
          nodes_path_json
        ]
      }
    }
  ]
  return [feature_ret, nodes_path_feature, nodes_path]
}

const getNearestPosition=(lon:number, lat:number, links:Link[], )=>{
  let nearestId:string|null = null;
  let minDistance = 100000000;
  for(let link of links){
    const [lonLink, latLink] = link.from
    const tmpDistance = Math.sqrt((lonLink-lon)**2+(latLink-lat)**2)
    if (minDistance > tmpDistance){
      minDistance = tmpDistance
      nearestId = link.from_string
    }
  }
  return nearestId
}

export function computePath(roadJsonLst:any[], startCoordinate:[lat:number, lon:number], endCoordinate:[lat:number, lon:number]): [any[],any[]] {
  // jsonからのデータ成形
  console.log("computing pathway")
  let links:Link[] = [];
  for(const roadJson of roadJsonLst){
    links = [...links, ...createLinksFromJson(roadJson)];
  }
  // const links = createLinksFromJson(roads)
  const start_id = getNearestPosition(startCoordinate[1], startCoordinate[0], links)
  const end_id = getNearestPosition(endCoordinate[1], endCoordinate[0], links)
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
      return link.data.weight;
    }
  });
  // 計算を実施
  const path_lst = pathFinder.find(end_id, start_id);


  // 計算結果よりリンクidを取得（描画用の座標に変換するため）
  const node_results:NodeResult[] = []
  // 植木算
  let check_to_lst = []
  let check_from_lst = []
  for (let i:number=0; i<= path_lst.length-2; i++){
    const path = path_lst[i]
    const path_next = path_lst[i+1]
    // nodeの座標を取得
    const node_id = path.id
    const node_next_id = path_next.id
    // それに対応するLinkIdを取得する
    const links_array = [...path.links]
    let link_id;
    let link_position
    for (let link_ of links_array){
      if (node_next_id===link_.fromId || node_next_id===link_.toId){
        link_id = `${link_.fromId}-${link_.toId}`
        link_position = node_next_id === link_.fromId ? "to" : "from";
        break
      }
    }
    const node_result:NodeResult = {
      node_id,
      link_id,
      link_position
    }
    node_results.push(node_result)
  }

  // 描画用の座標をfeaturesに格納
  // ノードによる描画を実施
  const [feature_ret, nodes_path_feature, nodes_path] = getFeature(node_results, links)

  return [nodes_path_feature, nodes_path]
}

/*
確認用、消しても問題ない
*/
function countAndFindDifferences(arr1: any[], arr2: any[]): { count: number, diff: any[] } {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  let count = 0;
  const diff: any[] = [];

  for (const item of set1) {
    if (set2.has(item)) {
      count++;
    } else {
      diff.push(item);
    }
  }

  for (const item of set2) {
    if (!set1.has(item)) {
      diff.push(item);
    }
  }
  return { count, diff };
}