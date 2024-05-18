import './App.css';
import React from 'react';
import { MapComponent } from './MapComponent';
import { LyricComponent } from './LyricComponent';


const App: React.FC = () => {
  return (
    
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
            <div id="map">
              <MapComponent />
            </div>
            <div id="song">
              <LyricComponent />
          </div>
        </div>
        <div id="history" className="split">
          a
          {/* <div className="char">{char}</div>
          <div className="chord">{chord}</div>
          <div className="chorus">曲遷移(0サビ):{chorus}</div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
