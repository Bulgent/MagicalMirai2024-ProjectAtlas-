import { useMemo } from "react"
import { PlayerControl } from './PlayerControlComponent.tsx';
import { getImage } from '../utils/utils.ts';
import songData from '../utils/Song.ts';


export const LyricComponent = (props: any) => {
  // 音楽を流すスピーカー（音楽を流すために必要）
  const div = useMemo(
    () => <div className="media" ref={props.handOverMediaElement} />,
    []
  );

  // 曲選択画面
  if (props.songNumber < 0 || props.songNumber >= songData.length) {
    return (
      <>
        <div className='mediacircle'>
          <div className="media-jacket"></div>
          <div className="media-seek">
            {songData.map((song, index) => (
              <button key={index} className='' onClick={() => props.handOverSongNumber(index)}>
                {song.title}
              </button>
            ))}
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
              <img className='jacketpic' src={getImage(props.songNumber)} alt='' />
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
                  <PlayerControl disabled={props.app.managed} player={props.player} handOverIsMapMove={props.handOverIsMapMove} />
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
