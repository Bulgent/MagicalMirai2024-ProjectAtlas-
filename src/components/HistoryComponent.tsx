import '../styles/App.css';
import { checkPartOfSpeech } from "../utils/utils.ts"

export const HistoryComponent = (props: any) => {

    const showHover = () => {
        let historyText: string = ""
        props.hoverHistory.map((hover: any) => {
            // console.log(hover.properties.name)
            historyText += hover.properties.name + "▶"
        })
        console.log(props.hoverHistory)
        return historyText
    }

    // 曲読み込み済みか?
    if ((props.player) != null) {
        return (
            <>
                <div className='kashihistory'> {props.lyricPhrase.text} </div>
                <div className='debughistory'>
                    {/* <div>URL：{songRead[props.songnum].songURL}</div> */}
                    {/* <div>曲名：{props.player.data.song.name}</div>
                    <div>作曲：{props.player.data.song.artist.name}</div>
                    <div>歌手：{songRead[props.songnum].vocaloid.japanese}</div> */}
                    <div>歌詞：{props.lyricPhrase.text}</div>
                    <div>単語：{props.lyricWord.text}</div>
                    <div>品詞：{checkPartOfSpeech(props.lyricWord.pos)} ({props.lyricWord.pos})</div>
                    <div>文字：{props.lyricChar.text}</div>
                    <div>-----------------------------</div>
                    <div>ｺｰﾄﾞ：{props.songChord}</div>
                    <div>ﾋﾞｰﾄ：{props.songBeat}</div>
                    <div>ｻﾋﾞ?：{(props.songChorus == null) ? "NO" : "YES"}</div>
                    <div>経過：{Math.floor(props.player.timer.position / 1000 * 100) / 100} 秒</div>
                    <div>長さ：{props.player.data.song.length} 秒</div>
                    <div>-----------------------------</div>
                    <div>ﾎﾊﾞｰ：{showHover()}</div>
                </div>
            </>
        )
    }
    else {
        return (
            null
        )
    }
}
