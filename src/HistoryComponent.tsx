import './App.css';
import { useCallback, useState, useEffect } from 'react';

import songRead from './song_data/Song';

export const HistoryComponent = (props: any) => {

    console.log(props.hoverHistory)

    // 品詞の判定
    const checkPartOfSpeech = (pos: string) => {
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
        switch (pos) {
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

    // 曲読み込み済みか?
    if ((props.player) != null) {
        return (
            <>
                <div>URL：{songRead[props.songnum].songURL}</div>
                <div>曲名：{props.player.data.song.name}</div>
                <div>作曲：{props.player.data.song.artist.name}</div>
                <div>歌手：{songRead[props.songnum].vocaloid.japanese}</div>
                <div>-----------------------------</div>
                <div>歌詞：{props.kashiPhrase.text}</div>
                <div>単語：{props.kashiWord.text}</div>
                <div>品詞：{checkPartOfSpeech(props.kashiWord.pos)} ({props.kashiWord.pos})</div>
                <div>文字：{props.kashiChar.text}</div>
                <div>-----------------------------</div>
                <div>ｺｰﾄﾞ：{props.songChord}</div>
                <div>ﾋﾞｰﾄ：{props.songBeat}</div>
                <div>ｻﾋﾞ?：{(props.songChorus == null) ? "NO" : "YES"}</div>
                <div>経過：{Math.floor(props.player.timer.position / 1000 * 100) / 100} 秒</div>
                <div>長さ：{props.player.data.song.length} 秒</div>
                <div>-----------------------------</div>
                <div>ホバー：{props.hoverHistory[1]?.properties.name}</div>
            </>
        )
    }
    else {
        return (
            <>
                <div></div>
            </>
        )
    }
}
