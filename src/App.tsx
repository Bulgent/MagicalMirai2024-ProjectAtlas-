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

console.log("App")
const App: React.FC = () => {
  // LyricComponentからの歌詞をMapComponentに受け渡す(Wordだけ品詞が取得できる)
  const [kashiChar, setKashiChar] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 })
  const [kashiWord, setKashiWord] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 , pos: ""})
  const [kashiPhrase, setKashiPhrase] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 })
  const [songChord, setSongChord] = useState<string>("")
  const [songChorus, setSongChorus] = useState<string>("")
  const [songBeat, setSongBeat] = useState<string>("")
  const [songInfo, setSongInfo] = useState<number>(-1)
  const [player, setPlayer] = useState<Object>()
  const handOverChar = (songChar:kashiProperties) => {
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

  return (
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id="map">
            {/* 単語:kashiChar, 熟語:kashiWord, フレーズ:kashiPhrase */}
            <MapComponent kashi={kashiWord} songnum={songInfo} /> 
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
                            songnum={songInfo} player={player} />
          {/* <div className="char">{char}</div>
          <div className="chord">{chord}</div>
          <div className="chorus">曲遷移(0サビ):{chorus}</div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;