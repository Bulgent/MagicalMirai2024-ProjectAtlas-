import '../styles/App.css';
import React from 'react';
import { useState, useMemo, useCallback, useEffect } from "react"
import { LyricComponent } from '../components/LyricComponentKai';

/**
 * handOver作成関数
 */
const createHandOverFunction = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
  return useCallback((value: T) => {
    setter(value);
    // console.log("親受取:", value);
  }, [setter]);
};

const App: React.FC = () => {
  // 楽曲情報の作成

// FUNFUN度の計算
  return (
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id="song">
            <LyricComponent />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;