import { useMemo } from "react"
import { PlayerControl } from './PlayerControlComponent.tsx';
import songData from '../utils/Song.ts';


export const LyricComponent = (props:any) =>{
  // 音楽を流すスピーカー（音楽を流すために必要）
  const div = useMemo(
      () => <div className="media" ref={props.handOverMediaElement} />,
      []
  );
  const getImage = (): string => {
    return new URL(`../assets/images/jacket/${songData[props.songNumber].jacketName}`, import.meta.url).href;
  };

  // 曲選択画面
  if (props.songNumber < 0) {
    return (
      <>
        <div className='mediacircle'>
          <div className="media-jacket"></div>
          <div className="media-seek">
            <button type="button" onClick={() => props.handOverSongNumber(0)}>SUPERHERO</button>
            <button type="button" onClick={() => props.handOverSongNumber(1)}>いつか君と話したミライは</button>
            <button type="button" onClick={() => props.handOverSongNumber(2)}>フューチャーノーツ</button>
            <button type="button" onClick={() => props.handOverSongNumber(3)}>未来交響曲</button>
            <button type="button" onClick={() => props.handOverSongNumber(4)}>リアリティ</button>
            <button type="button" onClick={() => props.handOverSongNumber(5)}>The Marks</button>
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
                <div className='songtitle'>♪{props.songTitle}</div>
                <div className='songartist'>{props.songArtist}</div>
              </div>
              <div className='playartist'>
                <div className="time">
                  {('00' + Math.floor((props.playTime / 1000) / 60)).slice(-2)}:{('00' + Math.floor((props.playTime / 1000) % 60)).slice(-2)} / {('00' + Math.floor(props.songLength / 60)).slice(-2)}:{('00' + Math.floor(props.songLength % 60)).slice(-2)}
                </div>
              </div>
              <div className="controls">
                {props.player && props.app && (
                  <PlayerControl disabled={props.app.managed} player={props.player} handOverIsMapMove={props.handOverIsMapMove}/>
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