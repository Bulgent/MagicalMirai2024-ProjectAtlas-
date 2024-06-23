import { useCallback } from 'react'
import songData from './Song.ts'

// 👽歌詞の種類を判別するための正規表現👽
const hiraganaRegex = /^[ぁ-ん]+$/;
const katakanaRegex = /^[ァ-ン]+$/;
const kanjiRegex = /^[一-龥]+$/;
const englishRegex = /^[a-zA-Z]+$/;
const numberRegex = /^[0-9]+$/;
const symbolRegex = /^[!-/:-@[-`{-~、。！？「」]+$/;
const spaceRegex = /^\s+$/;

// 👽歌詞の種類👽
export const enum KashiType {
  HIRAGANA = 0,
  KATAKANA = 1,
  KANJI = 2,
  ENGLISH = 3,
  NUMBER = 4,
  SYMBOL = 5,
  SPACE = 6,
  OTHER = 7
}

// 👽歌詞の種類を判別する👽
export const checkKashiType = (text: string): KashiType => {
  if (hiraganaRegex.test(text)) {
    // console.log(text, "ひらがな")
    return KashiType.HIRAGANA;
  }
  else if (katakanaRegex.test(text)) {
    // console.log(text, "カタカナ")
    return KashiType.KATAKANA;
  }
  else if (kanjiRegex.test(text)) {
    // console.log(text, "漢字")
    return KashiType.KANJI;
  }
  else if (englishRegex.test(text)) {
    // console.log(text, "英語")
    return KashiType.ENGLISH;
  }
  else if (numberRegex.test(text)) {
    // console.log(text, "数字")
    return KashiType.NUMBER;
  }
  else if (symbolRegex.test(text)) {
    // console.log(text, "記号")
    return KashiType.SYMBOL;
  }
  else if (spaceRegex.test(text)) {
    // console.log(text, "スペース")
    return KashiType.SPACE;
  }
  else {
    // console.log(text, "その他")
    return KashiType.OTHER;
  }
};

// 歌詞の種類を文字列で返す
export const formatKashi = (char: string) => {
  let printKashi = "";
  switch (checkKashiType(char)) {
    case KashiType.HIRAGANA:
      printKashi = "hiragana";
      break;
    case KashiType.KATAKANA:
      printKashi = "katakana";
      break;
    case KashiType.KANJI:
      printKashi = "kanji";
      break;
    case KashiType.ENGLISH:
      printKashi = "english";
      break;
    case KashiType.NUMBER:
      printKashi = "number";
      break;
    case KashiType.SYMBOL:
      printKashi = "symbol";
      break;
    case KashiType.SPACE:
      printKashi = "space";
      break;
    default:
      printKashi = "other";
      break;
  }
  return printKashi;
};

// 👽建物の種類👽
export const enum ArchType {
  NOT_FOUND = 0, // 未発見
  THEATRE = 1, // 映画館
  PUBLIC = 2, // 公会堂，集会場
  ENTERTAINMENT = 3, // 劇場，演芸場
  EXHIBITION = 4, // 展示場
  GYM = 5, // 客席を有する体育館，観覧場
  OTHER = 6 // その他集客施設
}

// 👽建物の種類を判別する👽
export const checkArchType = (type: number): string => {
  switch (type) {
    case ArchType.THEATRE:
      // console.log("映画館")
      return "映画館";
    case ArchType.PUBLIC:
      // console.log("公会堂，集会場")
      return "公会堂，集会場";
    case ArchType.ENTERTAINMENT:
      // console.log("劇場，演芸場")
      return "劇場，演芸場";
    case ArchType.EXHIBITION:
      // console.log("展示場")
      return "展示場";
    case ArchType.GYM:
      // console.log("体育館，観覧場")
      return "体育館，観覧場";
    case ArchType.OTHER:
      // console.log("その他集客施設")
      return "その他集客施設";
    default:
      // console.log("未発見")
      return "未発見";
  }
}

// 任意の小数点の桁（scale）で四捨五入
export const roundWithScale = (value: number, scale: number) => {
  return Math.round(value * 10 ** scale) / 10 ** scale;
};

// 品詞の判定
export const checkPartOfSpeech = (PoS: string) => {
  // N: 名詞 (Noun)
  // PN: 代名詞 (ProNoun)
  // V: 動詞 (Verb)
  // R: 副詞 (adveRb)
  // J: 形容詞 (adJective)
  // A: 連体詞 (Adnominal adjective)
  // P: 助詞 (Particle)
  // M: 助動詞 (Modal)
  // W: 疑問詞 (Wh)
  // D: 冠詞 (Determiner)
  // I: 接続詞 (conjunction)
  // U: 感動詞 (Interjection)
  // F: 接頭詞 (preFix)
  // S: 記号 (Symbol)
  // X: その他 (other)
  switch (PoS) {
    case "N":
      return "名詞";
    case "PN":
      return "代名詞";
    case "V":
      return "動詞";
    case "R":
      return "副詞";
    case "J":
      return "形容詞";
    case "A":
      return "連体詞";
    case "P":
      return "助詞";
    case "M":
      return "助動詞";
    case "W":
      return "疑問詞";
    case "D":
      return "冠詞";
    case "I":
      return "接続詞";
    case "U":
      return "感動詞";
    case "F":
      return "接頭詞";
    case "S":
      return "記号";
    case "X":
      return "その他";
    default:
      return "不明";
  }
}

export const cssSlide = (animationNum: number): string => {
  let randomX: number;
  let randomY: number;

  // X軸の乱数を生成
  if (Math.random() < 0.5) {
    randomX = Math.floor(Math.random() * (-101 - (-300) + 1)) + (-300); // -500から-101
  } else {
    randomX = Math.floor(Math.random() * (300 - 101 + 1)) + 101; // 101から500
  }

  // Y軸の乱数を生成(下は控えめ)
  if (Math.random() < 0.5) {
    randomY = Math.floor(Math.random() * (-101 - (-700) + 1)) + (-700); // -500から-101
  } else {
    randomY = Math.floor(Math.random() * (200 - 101 + 1)) + 101; // 101から200
  }
  return `@keyframes fadeInSlideXY${animationNum} {
      0% {
        opacity: 0.5;
        transform: translate3d(0%, 0%, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(${randomX}%, ${randomY}%, 0);
      }
    }`;
};

/**
 * @return
 * [x-vector, y-vector, scalar]
 */
export const calculateVector = (
  position: [number, number],
  nextPosition: [number, number],
): [number, number, number] => {
  const distance: number = Math.sqrt((nextPosition[0] - position[0]) ** 2 + (nextPosition[1] - position[1]) ** 2)
  // const distance :number = 1;
  return [
    (nextPosition[0] - position[0]),
    (nextPosition[1] - position[1]),
    distance
  ];
};

/**
 * handOver作成関数
 */
export const createHandOverFunction = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
  return useCallback((value: T) => {
    setter(value);
    // console.log("親受取:", value);
  }, [setter]);
};


export const deg2rad = (deg: number): number => {
  return (deg * Math.PI) / 180.0;
};

/**
 * ~~緯度経度から距離kmに変換~~  
 * 緯度経度のベクトルから距離を計算  
 * メルカトル系では縦横比がいびつなのでkmではなく、緯度経度をベクトルとした距離計算に変更  
 * HACK: 別関数に適用したい
 */
export const calculateDistance = (from_lonlat: [number, number], to_lonlat: [number, number]): number => {
  const RX: number = 6378.137; // 回転楕円体の長半径（赤道半径）[km]
  const RY: number = 6356.752; // 回転楕円体の短半径（極半径) [km]
  const dx = deg2rad(from_lonlat[0]) - deg2rad(to_lonlat[0]);
  const dy = deg2rad(from_lonlat[1]) - deg2rad(to_lonlat[1]);
  const mu = (deg2rad(from_lonlat[1]) + deg2rad(to_lonlat[1])) / 2.0; // μ
  const E = Math.sqrt(1 - Math.pow(RY / RX, 2.0)); // 離心率
  const W = Math.sqrt(1 - Math.pow(E * Math.sin(mu), 2.0));
  const M = RX * (1 - Math.pow(E, 2.0)) / Math.pow(W, 3.0); // 子午線曲率半径
  const N = RX / W; // 卯酉線曲率半径
  const distance_km = Math.sqrt(Math.pow(M * dy, 2.0) + Math.pow(N * dx * Math.cos(mu), 2.0));
  const distance_vector: number = Math.sqrt((from_lonlat[0] - to_lonlat[0]) ** 2 + (from_lonlat[1] - to_lonlat[1]) ** 2)
  return distance_vector// 距離[km]
}

/**
 * それぞれの道路の全体における割合を計算（積算）
 * @param nodes 経由地点の緯度経度ペアの配列
 * @returns 各道路の距離の割合の配列 (例: [0, 0.1, 0.5, 0.9, 1])
 */
export const calculateEachRoadLengthRatio = (nodes: any[]): number[] => {
  let eachRoadLengthRatio = [];
  let roadLengthSum = 0;
  const lstLength = nodes.length

  for (let i = 0; i < lstLength - 1; i++) {
    const roadLength = calculateDistance(nodes[i], nodes[i + 1])
    roadLengthSum += roadLength
    eachRoadLengthRatio.push(roadLengthSum)
  }
  eachRoadLengthRatio = eachRoadLengthRatio.map(x => x / roadLengthSum)
  return eachRoadLengthRatio
}

/**
 * 曲の進行状況に応じて、現在の経由地点のインデックスと次のインデックスまでの残り距離の割合を返す
 * @param ratio 曲の全体に対する現在の進行状況 (0 ~ 1)
 * @param ratioLst 各道路の距離の割合の配列
 * @returns 現在の経由地点のインデックスと残り距離の割合の配列 [インデックス, 残り距離の割合]
 */
export const getRationalPositonIndex = (ratio: number, ratioLst: number[]): [number, number] => {
  const lstLength = ratioLst.length
  for (let i = 0; i <= lstLength - 2; i++) {
    if (ratioLst[i] <= ratio && ratio < ratioLst[i + 1]) {
      return [i + 1, (ratio - ratioLst[i]) / (ratioLst[i + 1] - ratioLst[i])]
    }
  }
  if (ratio < ratioLst[0]) {
    return [0, ratio / ratioLst[0]]
  } else if (ratioLst[lstLength - 1] <= ratio && ratio <= 1) {
    return [lstLength - 1, (ratio - ratioLst[lstLength - 1]) / (ratioLst[lstLength - 1] - ratioLst[lstLength - 2])]
  } else {
    throw new Error("値が見つかりません")
  }
}

export const hexToRgb = (hex:string) =>{
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export const rgbToHex = (r:number, g:number, b:number) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * 色の継時変化を計算  
 * 色はhexを想定  
 * progressは0-1
 */
export const changeColor = (startHex:string, endHex:string, progress:number) => {
  const startColor = hexToRgb(startHex)!;
  const endColor = hexToRgb(endHex)!;
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);
  const color = rgbToHex(r, g, b);
  return color
}
export const getImage = (songNumber : number): string => {
  return new URL(`../assets/images/jacket/${songData[songNumber].jacketName}`, import.meta.url).href;
};
