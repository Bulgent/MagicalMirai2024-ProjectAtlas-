// 型定義
interface SongData {
    id: number;
    title: string;
    artist: string;
    vocaloid: {
        name: string;
        japanese?: string;
        num: number;
    },
    songURL: string;
    video: {
        // 音楽地図訂正履歴s
        beatId: number; // ビート情報のリビジョンID
        chordId: number; // コード進行の情報のリビジョンID
        repetitiveSegmentId: number; // サビなどの繰り返し区間のリビジョンID 
        lyricId: number; // 歌詞ID -1: 最新 0: 読み込まない それ以外: 指定されたID
        lyricDiffId: number; // 歌詞訂正ID
    },
    jacketName: string;
    note: string;
    startPosition: [lat: number, lng: number];
    turningPoint1?:[startMs: number, endMs: number];
    turningPoint2?:[startMs: number, endMs:number];
    duration?: number;
}

enum vocaloidNum {
    MIKU, // 初音ミク 0
    RINLEN, // 鏡音リン・レン 1
    LUKA, // 巡音ルカ 2
    KAITO, // KAITO 3
    MEIKO, // MEIKO 4
    GUMI, // GUMI 5
    IA, // IA 6
    GAKUPPOID // 神威がくぽ 7
}


// 曲情報
const song1: SongData = {
    id: 0,
    title: "SUPERHERO",
    artist: "めろくる",
    vocaloid: {
        name: "len",
        japanese: "鏡音レン",
        num: vocaloidNum.RINLEN
    },
    songURL: "https://piapro.jp/t/hZ35/20240130103028",
    video: {
        // https://songle.jp/songs/2712735/history
        // 音楽地図訂正履歴
        beatId: 4592293,
        chordId: 2727635,
        repetitiveSegmentId: 2824326,
        // 歌詞タイミング訂正履歴
        lyricId: 59415,
        lyricDiffId: 13962
    },
    jacketName: "superhero.png",
    note: "🎵",
    startPosition:[34.51961796222499, 135.44388626567633], // 鴨公園
    turningPoint1:[97000, 122000], 
    turningPoint2:[15700, 173000],
    duration: 211540, // 3分31秒
};

const song2: SongData = {
    id: 1,
    title: "いつか君と話したミライは",
    artist: "タケノコ少年",
    vocaloid: {
        name: "miku",
        japanese: "初音ミク",
        num: vocaloidNum.MIKU
    },
    songURL: "https://piapro.jp/t/--OD/20240202150903",
    video: {
        // 音楽地図訂正履歴
        beatId: 4592296,
        chordId: 2727636,
        repetitiveSegmentId: 2824327,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2F--OD%2F20240202150903
        lyricId: 59416,
        lyricDiffId: 13963
    },
    jacketName: "itsuka_kimi_to_hanashita_mirai_wa.png",
    note: "🎵",
    startPosition:[34.53924831533973, 135.52058805420313], // 出雲大社大阪分祠
    turningPoint1:[73000, 82000], 
    turningPoint2:[142000, 161000],
    duration: 211650, // 3分31秒 
};

const song3: SongData = {
    id: 2,
    title: "フューチャーノーツ",
    artist: "shikisai",
    vocaloid: {
        name: "miku",
        japanese: "初音ミク",
        num: vocaloidNum.MIKU
    },
    songURL: "https://piapro.jp/t/XiaI/20240201203346",
    video: {
        // 音楽地図訂正履歴
        beatId: 4592297,
        chordId: 2727637,
        repetitiveSegmentId: 2824328,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FXiaI%2F20240201203346
        lyricId: 59417,
        lyricDiffId: 13964
    },
    jacketName: "future_notes.png",
    note: "🎵",
    startPosition:[34.65358988491993, 135.5119111348351], // 通天閣
    turningPoint1:[52000, 61000], 
    turningPoint2:[84000, 94000],
    duration: 153190, // 2分33秒
};

const song4: SongData = {
    id: 3,
    title: "未来交響曲",
    artist: "ヤマギシコージ",
    vocaloid: {
        name: "miku",
        japanese: "初音ミク",
        num: vocaloidNum.MIKU
    },
    songURL: "https://piapro.jp/t/Rejk/20240202164429",
    video: {
        // 音楽地図訂正履歴
        beatId: 4592298,
        chordId: 2727638,
        repetitiveSegmentId: 2824329,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FRejk%2F20240202164429
        lyricId: 59418,
        lyricDiffId: 13965
    },
    jacketName: "mirai_koukyoukyoku.png",
    note: "🎵",
    startPosition:[34.6862484259693, 135.5245488140691], // 大阪城
    turningPoint1:[84000, 91000], 
    turningPoint2:[173000, 189000],
    duration: 189290, // 3分9秒 
};

const song5: SongData = {
    id: 4,
    title: "リアリティ",
    artist: "歩く人",
    vocaloid: {
        name: "miku",
        japanese: "初音ミク",
        num: vocaloidNum.MIKU
    },
    songURL: "https://piapro.jp/t/ELIC/20240130010349",
    video: {
        // 音楽地図訂正履歴
        beatId: 4592299,
        chordId: 2727639,
        repetitiveSegmentId: 2824330,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FELIC%2F20240130010349
        lyricId: 59419,
        lyricDiffId: 13966
    },
    jacketName: "reality.png",
    note: "🎵",
    startPosition:[34.56316397827468, 135.48654690775095], // 仁徳天皇陵古墳
    turningPoint1:[52000, 60000], 
    turningPoint2:[111000, 126000],
    duration: 192200, // 3分12秒 
};

const song6: SongData = {
    id: 5,
    title: "The Marks",
    artist: "2ouDNS",
    vocaloid: {
        name: "miku",
        japanese: "初音ミク",
        num: vocaloidNum.MIKU
    },
    songURL: "https://piapro.jp/t/xEA7/20240202002556",
    video: {
        // 音楽地図訂正履歴
        beatId: 4592300,
        chordId: 2727640,
        repetitiveSegmentId: 2824331,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FxEA7%2F20240202002556
        lyricId: 59420,
        lyricDiffId: 13967
    },
    jacketName: "the_marks.png",
    note: "🎵",
    startPosition:[34.53734513653503, 135.46062151011384], // 大鳥大社
    turningPoint1:[67000, 84000], 
    turningPoint2:[137000, 150000],
    duration: 192240, // 3分12秒
};

// 曲配列
const songData = [song1, song2, song3, song4, song5, song6]

// 外部読み込み
export default songData;
