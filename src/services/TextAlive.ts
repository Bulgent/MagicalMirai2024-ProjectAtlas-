import { Player } from 'textalive-app-api';
import songData from '../utils/Song.ts';
import { createPlayerContent, handOverLyric } from '../types/types';

/**
 * 曲が流れている最中に取得できる歌詞情報を外部に渡す処理
 */
/* @ts-ignore */
const getLyricElement = (lyric: any, player: Player, handover: handOverLyric) => {
    while (lyric && lyric.next) {
        let isFirstPhrase: boolean = true;
        // フレーズ
        lyric.animate = (currentLyric: any, entireLyric: any) => {
            // 文字が時間内の時
            if (entireLyric.contains(currentLyric) && isFirstPhrase) {
                // 歌詞の更新
                handover(entireLyric);   // 歌詞を親に渡す
                isFirstPhrase = false;
            }
        };
        lyric = lyric.next;  // 次の文字
    }
    // 最後の歌詞
    lyric.animate = (currentLyric: any, entireLyric: any) => {
        // 文字が時間内の時
        if (entireLyric.startTime <= currentLyric && entireLyric.endTime > currentLyric) {
            // 歌詞の更新
            handover(entireLyric); // 歌詞を親に渡す
        }
    };
}

/**
 * 曲情報取得のためのマスター関数
 * 取得した値や管理情報はhandoverして外部に渡す
 */
export const createPlayer = (createPlayerContent: createPlayerContent) => {
    const player = new Player({
        app: {
            token: 'elLljAkPmCHHiGDP', // トークンは https://developer.textalive.jp/profile で取得したものを使う
        },
        mediaElement: createPlayerContent.mediaElement,
    });

    const onAppReady = (app: any) => {
        // console.log('--- [app] initialized as TextAlive app ---');
        // console.log('managed:', app.managed);
        player.createFromSongUrl(songData[createPlayerContent.songNumber].songURL, {
            video: {
                // 音楽地図訂正履歴
                beatId: songData[createPlayerContent.songNumber].video.beatId,
                chordId: songData[createPlayerContent.songNumber].video.chordId,
                repetitiveSegmentId: songData[createPlayerContent.songNumber].video.repetitiveSegmentId,
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
                lyricId: songData[createPlayerContent.songNumber].video.lyricId,
                lyricDiffId: songData[createPlayerContent.songNumber].video.lyricDiffId,
            },
        });
        createPlayerContent.handOverApp(app);
    }

    const onVideoReady = () => {
        document.documentElement.style.setProperty('--beat', '0');
        // console.log('--- [app] video is ready ---');
        // console.log('player:', player);
        // console.log('player.data.song:', player.data.song);
        // console.log('読込曲:', player.data.song.name, " / ", player.data.song.artist.name);
        // console.log('player.data.songMap:', player.data.songMap);
        createPlayerContent.handOverSongTitle(player.data.song.name)
        createPlayerContent.handOverSongArtist(player.data.song.artist.name)
        createPlayerContent.handOverSongLength(player.data.song.length)
        // player.volume = volume 音量調整する？五月蝿いので小さくしました
        createPlayerContent.handOverPlayer(player);
        createPlayerContent.handOverSongInfo(createPlayerContent.songNumber)
        // 一番最初の文字
        let kashiChar = player.video.firstChar; // 最初の文字(好)
        let kashiWord = player.video.firstWord; // 最初の熟語(好き)
        let kashiPhrase = player.video.firstPhrase; // 最初の歌詞(好きの伝え方は一つじゃないから)
        // console.log(player, kashiChar.text, kashiWord.text, kashiPhrase.text)
        // 音楽が流れている間のそれぞれの歌詞情報取得処理
        // Char: 文字, Word: 単語, Phrase: 歌詞
        getLyricElement(kashiChar, player, createPlayerContent.handOverChar)
        getLyricElement(kashiWord, player, createPlayerContent.handOverWord)
        getLyricElement(kashiPhrase, player, createPlayerContent.handOverPhrase)
    }

    let prevBeatPosition = -1;
    const onTimeUpdate = (position: number) => {
        createPlayerContent.handOverPlayTime(position);
        // コードの更新
        createPlayerContent.handOverChord(player.findChord(position).name);
        // ビートの更新
        const beat = player.findBeat(position);
        if (beat.position != prevBeatPosition) {
            // console.log(beat)
            let beatText = '';
            for (let i = 0; i < beat.position; i++) {
                beatText += '* ';
            }
            createPlayerContent.handOverBeat(beat);
            prevBeatPosition = beat.position;
        }
        // コーラスの更新
        createPlayerContent.handOverChorus(player.findChorus(position));
        const relativePosition = 1 * (position - beat.startTime) / beat.duration;
        // ちょっと重い
        document.documentElement.style.setProperty('--beat', relativePosition.toString());
    }
    // 曲イベント
    const playerListener = {
        onAppReady,
        onVideoReady,
        onTimeUpdate
    };
    // イベント登録
    player.addListener(playerListener);
    return { player, playerListener }
}