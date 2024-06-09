import './App.css';
import React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { MapComponent } from './MapComponent';
import { LyricComponent } from './LyricComponent';
import { HistoryComponent } from './HistoryComponent';

interface kashiProperties {
  text: string;
  startTime: number;
  endTime: number;
  pos?: string;
}
interface historyProperties {
  type: string,
  properties: {
      type: number,
      name: string
  },
  geometry: {
      type: string,
      coordinates: [number, number]
  }
}

console.log("App")

const App: React.FC = () => {
  // LyricComponentからの歌詞をMapComponentに受け渡す(Wordだけ品詞が取得できる)
  const [kashiChar, setKashiChar] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 })
  const [kashiWord, setKashiWord] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0, pos: "" })
  const [kashiPhrase, setKashiPhrase] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 })
  const [songChord, setSongChord] = useState<string>("")
  const [songChorus, setSongChorus] = useState<string>("")
  const [songBeat, setSongBeat] = useState<string>("")
  const [songInfo, setSongInfo] = useState<number>(-1)
  const [player, setPlayer] = useState<Object>()
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([])
  const handOverChar = (songChar: kashiProperties) => {
    setKashiChar(songChar)
    // console.log("親受取単語:", songChar)
  }
  const handOverWord = (songWord: kashiProperties) => {
    setKashiWord(songWord)
    // console.log("親受取熟語:", songWord)
  }
  const handOverPhrase = (songPhrase: kashiProperties) => {
    setKashiPhrase(songPhrase)
    // console.log("親受取フレーズ:", songPhrase)
  }
  const handOverChord = (songChord: string) => {
    setSongChord(songChord)
    // console.log("親受取コード:", songChord)
  }
  const handOverBeat = (songBeat: string) => {
    setSongBeat(songBeat)
    // console.log("親受取ビート:", songBeat)
  }
  const handOverChorus = (songChorus: string) => {
    setSongChorus(songChorus)
    // console.log("親受取コーラス:", songChorus)
  }
  const handOverSongInfo = (songInfo: number) => {
    setSongInfo(songInfo)
  }
  const handOverPlayer = (player: any) => {
    setPlayer(player)
    // console.log(player)
  }
  // MapComponentからのホバー情報を受け取る
  const handOverHover = (hover : historyProperties) => {
    //hoverhistory に追加(重複削除)
    setHoverHistory((prev) => [...new Set([...prev, hover])]);
  }

  const [isMoving, setIsMoving] = useState(false);
  // 機能テスト用
  // isMovingを切り替える（地図移動の発火点）
  const handleMapMove = () => {
    setIsMoving((prevIsMoving) => !prevIsMoving);
  };
// FUNFUN度の計算
  return (

    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id="map">
            {/* 単語:kashiChar, 熟語:kashiWord, フレーズ:kashiPhrase */}
            <MapComponent kashi={kashiWord} songnum={songInfo}  isMoving={isMoving} handOverHover={handOverHover}/>
          </div>
          <div id="song">
            <LyricComponent handOverChar={handOverChar} handOverWord={handOverWord} handOverPhrase={handOverPhrase}
              handOverChord={handOverChord} handOverBeat={handOverBeat} handOverChorus={handOverChorus}
              handOverSongInfo={handOverSongInfo} handOverPlayer={handOverPlayer} />
          </div>
        </div>
        <div id="history" className="split">
          <HistoryComponent kashiChar={kashiChar} kashiWord={kashiWord} kashiPhrase={kashiPhrase}
            songChord={songChord} songBeat={songBeat} songChorus={songChorus}
            songnum={songInfo} player={player} hoverHistory={hoverHistory} />
          <button onClick={handleMapMove}>
            {isMoving ? '停止' : '地図を移動'}
          </button>
          {/* <div className="char">{char}</div>
          <div className="chord">{chord}</div>
          <div className="chorus">曲遷移(0サビ):{chorus}</div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;