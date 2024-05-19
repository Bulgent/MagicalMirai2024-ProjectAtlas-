import './App.css';
import React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { MapComponent } from './MapComponent';
import { LyricComponent } from './LyricComponent';
import { HistoryComponent } from './HistoryComponent';


console.log("App")
const App: React.FC = () => {
  // LyricComponentからの歌詞をMapComponentに受け渡す
  const [kashiChar, setKashiChar] = useState("")
  const [kashiWord, setKashiWord] = useState("")
  const [kashiPhrase, setKashiPhrase] = useState("")
  const handOverChar = (songChar: string) => {
    setKashiChar(songChar)
    // console.log("親受取単語:", songChar)
  }
  const handOverWord = (songWord: string) => {
    setKashiWord(songWord)
    // console.log("親受取熟語:", songWord)
  }
  const handOverPhrase = (songPhrase: string) => {
    setKashiPhrase(songPhrase)
    // console.log("親受取フレーズ:", songPhrase)
  }

  return (
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id="map">
            <MapComponent kashi={kashiChar}/>
          </div>
          <div id="song">
          <LyricComponent handOverChar={handOverChar} handOverWord={handOverWord} handOverPhrase={handOverPhrase} />
            {/* <LyricComponent handOverChar={handOverChar} /> */}
          </div>
        </div>
        <div id="history" className="split">
        <HistoryComponent kashiChar={kashiChar} kashiWord={kashiWord} kashiPhrase={kashiPhrase}/>
          {/* <div className="char">{char}</div>
          <div className="chord">{chord}</div>
          <div className="chorus">曲遷移(0サビ):{chorus}</div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;