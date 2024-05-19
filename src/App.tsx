import './App.css';
import React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { MapComponent } from './MapComponent';
import { LyricComponent } from './LyricComponent';


const App: React.FC = () => {
  // LyricComponentからの歌詞をMapComponentに受け渡す
  const [phrase, setPhrase] = useState("")
  const handOverKashi = (text : string) => {
      setPhrase(text)
      console.log("親受取歌詞:", text)
  }

  return (
    
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id="map">
            <MapComponent kashi={phrase}/>
          </div>
          <div id="song">
            <LyricComponent handOverKashi={handOverKashi}/>
          </div>
        </div>
        <div id="history" className="split">
          {/* <div className="char">{char}</div>
          <div className="chord">{chord}</div>
          <div className="chorus">曲遷移(0サビ):{chorus}</div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
