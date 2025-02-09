import '../styles/App.css';
import '../styles/Game.css';
import '../styles/Map.css';
import React from 'react';
import { Player } from 'textalive-app-api';
import { useState, useEffect } from "react"
/* @ts-ignore */
import { useLocation, useNavigate } from 'react-router-dom';
import { LyricComponent } from '../components/LyricComponent';
import { HistoryComponent } from '../components/HistoryComponent';
import { MapComponent } from '../components/MapComponent'
import { MapInfoComponent } from '../components/MapInfoComponent'
import { createPlayerContent, lyricProperties, historyProperties } from '../types/types';
import { createPlayer } from "../services/TextAlive.ts"
import { createHandOverFunction } from "../utils/utils.ts"
import { LatLngLiteral } from 'leaflet';
import songData from '../utils/Song.ts';


export const GamePage = () => {
  // TODO 後でコメントアウトアウト ?
  // サイトを離れるときにルートにリダイレクト
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     navigate('/'); // ルートにリダイレクト
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [navigate]);

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
  const [fanFun, setFanFun] = useState<number>(0);
  const [mikuMile, setMikuMile] = useState<[number, number]>([0, 0]);
  const [scale, setScale] = useState<number>(0);
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>({ lat: -1, lng: -1 });
  const handOverIsMapMove = createHandOverFunction(setIsMapMove);
  const [isSongEnd, setIsSongEnd] = useState<boolean>(false)

  // const [songNumber, setSongNumber] = useState(isDevelopment ? 3 : buttonInfo ? parseInt(buttonInfo) : -1);
  const [songNumber, setSongNumber] = useState(buttonInfo ? parseInt(buttonInfo) : -1);
  const handOverSongNumber = createHandOverFunction(setSongNumber) // 曲選択をLyricComponentで持たせることを想定
  const handOverMediaElement = createHandOverFunction(setMediaElement)
  const handOverMikuMile = createHandOverFunction(setMikuMile)
  const handOverScale = createHandOverFunction(setScale)
  const handOverMapCenter = createHandOverFunction(setMapCenter)
  const handOverSongEnd = createHandOverFunction(setIsSongEnd)

  // Map移動に関しての変数宣言
  const [hoverHistory, setHoverHistory] = useState<historyProperties[]>([])
  // MapComponentからのホバー情報を受け取る
  const handOverHoverHistory = (hover: historyProperties) => {
    // hoverhistory に追加(重複削除)
    setHoverHistory((prev) => [...new Set([...prev, hover])]);
  }
  const handOverFanFun = (point: number) => {
    // fanfun に追加
    setFanFun(prevFanFun => prevFanFun + point);
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
      // console.log('--- [app] shutdown ---');
      player?.removeListener(playerListener);
      player?.dispose();
    };
  }, [mediaElement])

  // FUNFUN度の計算
  return (
    <React.Fragment>
      <div id="display" className="soft-gloss">
        <div id="navi" className="split">
          <div id='overlay' className='reading-overlay active'>
            {(songNumber == -1) || (songNumber < 0) || (songData.length - 1 < songNumber) ? '曲選択エラー' : '目的地へのルート探索中...'}
          </div>
          <div id="map">
            {/* 単語:kashiChar, 熟語:kashiWord, フレーズ:kashiPhrase */}
            <MapComponent
              kashi={lyricWord}
              songnum={songInfo}
              isMoving={isMapMove}
              player={player}
              fanFun={fanFun}
              mikuMile={mikuMile}
              handOverHover={handOverHoverHistory}
              handOverFanFun={handOverFanFun}
              handOverMikuMile={handOverMikuMile}
              handOverScale={handOverScale}
              handOverMapCenter={handOverMapCenter}
              isSongEnd={handOverSongEnd}
            />
          </div>
          <div id="mapinfo">
            <MapInfoComponent
              mikuMile={mikuMile}
              mapCenter={mapCenter}
              isMoving={isMapMove}
              scale={scale}
              player={player}
              songEnd={isSongEnd}
            />
          </div>
          <div id="song">
            <LyricComponent
              songNumber={songNumber}
              songnum={songInfo}
              songTitle={songTitle}
              songArtist={songArtist}
              playTime={playTime}
              songLength={songLength}
              lyricPhrase={lyricPhrase}
              hoverHistory={hoverHistory}
              mikuMile={mikuMile}
              player={player}
              app={app}
              handOverSongNumber={handOverSongNumber}
              handOverMediaElement={handOverMediaElement}
              handOverIsMapMove={handOverIsMapMove}
              songEnd={isSongEnd}
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
            fanfun={fanFun}
            songEnd={isSongEnd}
          />
        </div>
        <img id='logo' src='/images/logo.png' alt='' />
      </div>
    </React.Fragment>
  );
}
