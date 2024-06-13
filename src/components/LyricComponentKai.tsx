import { createPlayer } from "../services/TextAlive.ts"
import { useState, useMemo, useCallback, useEffect } from "react"
import { Player } from 'textalive-app-api';
import { PlayerControl } from '../services/PlayerControlKai.tsx';
import songData from '../utils/Song.ts';
import {  createPlayerContent, lyricProperties } from '../types/types';

const createHandOverFunction = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
    return useCallback((value: T) => {
      setter(value);
      // console.log("親受取:", value);
    }, [setter]);
};


/*
 * playercontrolerの改変
 */

export const LyricComponent = () =>{
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
    const div = useMemo(
        () => <div className="media" ref={setMediaElement} />,
        []
      );
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

    const getImage = (): string => {
        return new URL(`../assets/images/jacket/${songData[songNumber].jacketName}`, import.meta.url).href;
      };
  // 曲選択画面
  if (songNumber < 0) {
    return (
      <>
        <div className='mediacircle'>
          <div className="media-jacket"></div>
          <div className="media-seek">
            <button type="button" onClick={() => setSongNumber(0)}>SUPERHERO</button>
            <button type="button" onClick={() => setSongNumber(1)}>いつか君と話したミライは</button>
            <button type="button" onClick={() => setSongNumber(2)}>フューチャーノーツ</button>
            <button type="button" onClick={() => setSongNumber(3)}>未来交響曲</button>
            <button type="button" onClick={() => setSongNumber(4)}>リアリティ</button>
            <button type="button" onClick={() => setSongNumber(5)}>The Marks</button>
          </div>
        </div>
      </>
    );
  }
  // 再生画面
  else {
    return (
      <>
        <div className='mediacircle'>
          <div className="media-seek">
            <div className='media-jacket transparent'>
              <img className='jacketpic' src={getImage()} alt='' />
            </div>
            <div className='media-info'>
              <div className='title-artist'>
                <div className='songtitle'>♪{songTitle}</div>
                <div className='songartist'>{songArtist}</div>
              </div>
              <div className='playartist'>
                <div className="time">
                  {('00' + Math.floor((playTime / 1000) / 60)).slice(-2)}:{('00' + Math.floor((playTime / 1000) % 60)).slice(-2)} / {('00' + Math.floor(songLength / 60)).slice(-2)}:{('00' + Math.floor(songLength % 60)).slice(-2)}
                </div>
              </div>
              <div className="controls">
                {player && app && (
                  <PlayerControl disabled={app.managed} player={player} />
                )}
              </div>
              {div}
            </div>
          </div>
        </div>
      </>
    );
  }
}