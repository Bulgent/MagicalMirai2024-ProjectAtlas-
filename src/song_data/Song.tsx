// 型定義
interface SongData {
    id: number;
    title: string;
    artist: string;
    songURL: string;
    video: {
        // 音楽地図訂正履歴
        beatId: number;
        chordId: number;
        repetitiveSegmentId: number;
        // 歌詞タイミング訂正履歴
        lyricId: number;
        lyricDiffId: number;
    },
    jacketName: string;
}

// 曲情報
const song1: SongData = {
    id: 0,
    title: "SUPERHERO",
    artist: "めろくる",
    songURL: "https://piapro.jp/t/hZ35/20240130103028",
    video: {
        // 音楽地図訂正履歴
        beatId: 4592293,
        chordId: 2727635,
        repetitiveSegmentId: 2824326,
        // 歌詞タイミング訂正履歴
        lyricId: 59415,
        lyricDiffId: 13962
    },
    jacketName: "superhero.png"
};

const song2: SongData = {
    id: 1,
    title: "いつか君と話したミライは",
    artist: "タケノコ少年",
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
    jacketName: "itsuka_kimi_to_hanashita_mirai_wa.png"
};

const song3: SongData = {
    id: 2,
    title: "フューチャーノーツ",
    artist: "shikisai",
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
    jacketName: "future_notes.png"
};

const song4: SongData = {
    id: 3,
    title: "未来交響曲",
    artist: "ヤマギシコージ",
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
    jacketName: "mirai_koukyoukyoku.png"
};

const song5: SongData = {
    id: 4,
    title: "リアリティ",
    artist: "歩く人",
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
    jacketName: "reality.png"
};

const song6: SongData = {
    id: 5,
    title: "The Marks",
    artist: "2ouDNS",
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
    jacketName: "the_marks.png"
};

// 曲配列
const songData = [song1, song2, song3, song4, song5, song6]

// 外部読み込み
export default songData;