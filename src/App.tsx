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
}

console.log("App")
const App: React.FC = () => {
  // LyricComponentからの歌詞をMapComponentに受け渡す
  const [kashiChar, setKashiChar] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 })
  const [kashiWord, setKashiWord] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 })
  const [kashiPhrase, setKashiPhrase] = useState<kashiProperties>({ text: "", startTime: 0, endTime: 0 })
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

  return (
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id="map">
            {/* 単語:kashiChar, 熟語:kashiWord, フレーズ:kashiPhrase */}
            <MapComponent kashi={kashiWord} /> 
          </div>
          <div id="song">
            <LyricComponent handOverChar={handOverChar} handOverWord={handOverWord} handOverPhrase={handOverPhrase} />
          </div>
        </div>
        <div id="history" className="split">
          <HistoryComponent kashiChar={kashiChar} kashiWord={kashiWord} kashiPhrase={kashiPhrase} />
          {/* <div className="char">{char}</div>
          <div className="chord">{chord}</div>
          <div className="chorus">曲遷移(0サビ):{chorus}</div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;