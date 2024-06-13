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
    console.log(text, "ひらがな")
    return KashiType.HIRAGANA;
  }
  else if (katakanaRegex.test(text)) {
    console.log(text, "カタカナ")
    return KashiType.KATAKANA;
  }
  else if (kanjiRegex.test(text)) {
    console.log(text, "漢字")
    return KashiType.KANJI;
  }
  else if (englishRegex.test(text)) {
    console.log(text, "英語")
    return KashiType.ENGLISH;
  }
  else if (numberRegex.test(text)) {
    console.log(text, "数字")
    return KashiType.NUMBER;
  }
  else if (symbolRegex.test(text)) {
    console.log(text, "記号")
    return KashiType.SYMBOL;
  }
  else if (spaceRegex.test(text)) {
    console.log(text, "スペース")
    return KashiType.SPACE;
  }
  else {
    console.log(text, "その他")
    return KashiType.OTHER;
  }
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
export const checkArchType = (type: number): ArchType => {
  switch (type) {
    case 1:
      console.log("映画館")
      return ArchType.THEATRE;
    case 2:
      console.log("公会堂，集会場")
      return ArchType.PUBLIC;
    case 3:
      console.log("劇場，演芸場")
      return ArchType.ENTERTAINMENT;
    case 4:
      console.log("展示場")
      return ArchType.EXHIBITION;
    case 5:
      console.log("体育館，観覧場")
      return ArchType.GYM;
    case 6:
      console.log("その他集客施設")
      return ArchType.OTHER;
    default:
      console.log("未発見")
      return ArchType.NOT_FOUND;
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