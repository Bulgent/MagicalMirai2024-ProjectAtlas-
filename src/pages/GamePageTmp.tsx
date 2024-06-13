import '../styles/App.css';
import React from 'react';
import { Player } from 'textalive-app-api';
import { useState, useCallback, useEffect } from "react"
import { LyricComponent } from '../components/LyricComponentKaiKai';
import { HistoryComponent } from '../components/HistoryComponentKai';
import {  createPlayerContent, lyricProperties, historyProperties } from '../types/types';
import { createPlayer } from "../services/TextAlive.ts"

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
  // TxtAlive周りの変数宣言
  const [lyricChar, setLyricChar] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 })
  const [lyricWord, setLyricWord] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0, pos: "" })
  const [lyricPhrase, setLyricPhrase] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 })
  const [songChord, setSongChord] = useState<string>("")
  const [songChorus, setSongChorus] = useState<string>("")
  const [songBeat, setSongBeat] = useState<string>("")
  const [songInfo, setSongInfo] = useState<number>(-1)
  const [player, setPlayer] = useState<Player | null>(null);
  const [app, setApp] = useState<any>()
  const [songTitle, setSongTitle] = useState<string>("")
  const [songArtist, setSongArtist] = useState<string>("")
  const [songLength, setSongLength] = useState<number>(0)
  const [playTime, setPlayTime] = useState<number>(0)
  const [mediaElement, setMediaElement] = useState(null);
  const [songNumber, setSongNumber] = useState(0);
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([])
  const handOverSongNumber = createHandOverFunction(setSongNumber) // 曲選択をLyricComponentで持たせることを想定
  const handOverMediaElement = createHandOverFunction(setMediaElement)
  const handOverHoverHistory = createHandOverFunction(setHoverHistory)
  const createPlayerContent: createPlayerContent = {
    mediaElement,
    songNumber,
    handOverPlayer: createHandOverFunction(setPlayer),
    handOverSongInfo: createHandOverFunction(setSongInfo),
    handOverChar: createHandOverFunction(setLyricChar),
    handOverWord: createHandOverFunction(setLyricWord),
    handOverPhrase: createHandOverFunction(setLyricPhrase),
    handOverBeat: createHandOverFunction(setSongBeat),
    handOverChord: createHandOverFunction(setSongChord),
    handOverChorus: createHandOverFunction(setSongChorus),
    handOverSongTitle:createHandOverFunction(setSongTitle),
    handOverSongArtist:createHandOverFunction(setSongArtist),
    handOverSongLength:createHandOverFunction(setSongLength),
    handOverPlayTime:createHandOverFunction(setPlayTime),
    handOverApp: createHandOverFunction(setApp)
  }

  // Txtaliveから情報取得開始
  useEffect(() => {
    // 曲選択前または画面描画前のときはエラーが出るのでスキップ
    if (songNumber < 0 || typeof window === 'undefined' || !mediaElement) {
        return;
      }
    // 音楽取得処理を作成（値は全てhandOverで取得）
    const { playerListener } = createPlayer(createPlayerContent)
    // 再生終了時
    return () => {
        console.log('--- [app] shutdown ---');
        player.removeListener(playerListener);
        player.dispose();
        };
  }, [mediaElement])

// FUNFUN度の計算
  return (
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id="song">
            <LyricComponent 
              songNumber={songNumber} 
              songTitle={songTitle}
              songArtist={songArtist}
              playTime={playTime}
              songLength={songLength}
              player={player}
              app={app}
              handOverSongNumber={handOverSongNumber}
              handOverMediaElement={handOverMediaElement}
            />
          </div>
            <div id="history" className="split">
            <HistoryComponent 
              lyricChar={lyricChar} 
              lyricWord={lyricWord} 
              lyricPhrase={lyricPhrase}
              songChord={songChord} 
              songBeat={songBeat} 
              songChorus={songChorus}
              songnum={songInfo} 
              player={player} 
              hoverHistory={hoverHistory} 
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;