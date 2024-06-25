import '../styles/App.css';
import '../styles/Game.css';
import '../styles/Map.css';
import React from 'react';
import { Player } from 'textalive-app-api';
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { LyricComponent } from '../components/LyricComponent';
import { HistoryComponent } from '../components/HistoryComponent';
import { MapComponent } from '../components/MapComponent'
import { createPlayerContent, lyricProperties, historyProperties } from '../types/types';
import { createPlayer } from "../services/TextAlive.ts"
import { createHandOverFunction } from "../utils/utils.ts"

export const GamePage = () => {
  // 開発環境について
  // const isDevelopment: boolean = process.env.NODE_ENV === 'development';
  // welcomePageからの情報取得
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const buttonInfo = queryParams.get('song'); // クエリパラメータからbuttonの値を取得

  // console.log(buttonInfo);
  // TxtAlive周りの変数宣言
  const [lyricChar, setLyricChar] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 })
  const [lyricWord, setLyricWord] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0, pos: "" })
  const [lyricPhrase, setLyricPhrase] = useState<lyricProperties>({ text: "", startTime: 0, endTime: 0 })
  const [songChord, setSongChord] = useState<string>("")
  const [songChorus, setSongChorus] = useState<object>({ init: true });
  const [songBeat, setSongBeat] = useState(-1)
  const [songInfo, setSongInfo] = useState<number>(-1)
  const [player, setPlayer] = useState<Player | null>(null);
  const [app, setApp] = useState<any>()
  const [songTitle, setSongTitle] = useState<string>("")
  const [songArtist, setSongArtist] = useState<string>("")
  const [songLength, setSongLength] = useState<number>(0)
  const [playTime, setPlayTime] = useState<number>(0)
  const [mediaElement, setMediaElement] = useState(null);
  const [isMapMove, setIsMapMove] = useState<Boolean>(false);
  const handOverIsMapMove = createHandOverFunction(setIsMapMove)

  // const [songNumber, setSongNumber] = useState(isDevelopment ? 3 : buttonInfo ? parseInt(buttonInfo) : -1);
  const [songNumber, setSongNumber] = useState(buttonInfo ? parseInt(buttonInfo) : -1);
  const handOverSongNumber = createHandOverFunction(setSongNumber) // 曲選択をLyricComponentで持たせることを想定
  const handOverMediaElement = createHandOverFunction(setMediaElement)

  // Map移動に関しての変数宣言
  const [isMoving, setIsMoving] = useState(false);
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([])
  const handleMapMove = () => {
    setIsMoving((prevIsMoving) => !prevIsMoving);
  };
  // MapComponentからのホバー情報を受け取る
  const handOverHoverHistory = (hover: historyProperties) => {
    //hoverhistory に追加(重複削除)
    setHoverHistory((prev) => [...new Set([...prev, hover])]);
  }

  // PlayerLister作成のための変数
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
    handOverSongTitle: createHandOverFunction(setSongTitle),
    handOverSongArtist: createHandOverFunction(setSongArtist),
    handOverSongLength: createHandOverFunction(setSongLength),
    handOverPlayTime: createHandOverFunction(setPlayTime),
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
      player?.removeListener(playerListener);
      player?.dispose();
    };
  }, [mediaElement])

  // FUNFUN度の計算
  return (
    <React.Fragment>
      <div id="display" className="soft-gloss">
        {/* OSMのクレジットいれる, OEmoJiも leaflet textalive */}
        {/* "All emojis designed by OpenMoji – the open-source emoji and icon project. License: CC BY-SA 4.0" */}

        <div id="navi" className="split">
          <div id='overlay' className='reading-overlay active'>
            目的地へのルート探索中...
          </div>
          <div id="map">
            {/* 単語:kashiChar, 熟語:kashiWord, フレーズ:kashiPhrase */}
            <MapComponent
              kashi={lyricWord}
              songnum={songInfo}
              isMoving={isMapMove}
              player={player}
              handOverHover={handOverHoverHistory}
            />
          </div>
          <div id="song">
            <LyricComponent
              songNumber={songNumber}
              songTitle={songTitle}
              songArtist={songArtist}
              playTime={playTime}
              songLength={songLength}
              lyricPhrase={lyricPhrase}
              player={player}
              app={app}
              handOverSongNumber={handOverSongNumber}
              handOverMediaElement={handOverMediaElement}
              handOverIsMapMove={handOverIsMapMove}
            />
          </div>
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
        <img id='logo' src='src/assets/images/logo.png' alt='' />
      </div>
    </React.Fragment>
  );
}
