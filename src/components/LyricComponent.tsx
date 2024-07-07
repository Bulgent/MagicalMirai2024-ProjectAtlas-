import { useMemo } from "react"
import { PlayerControl } from './PlayerControlComponent.tsx';
import { getImage } from '../utils/utils.ts';
import songData from '../utils/Song.ts';
import '../styles/Game.css';

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
        {/* <div className='mediacircle'>
          <div className="media-jacket"></div>
          <div className="media-seek">
            {songData.map((song, index) => (
              <button key={index} className='' onClick={() => props.handOverSongNumber(index)}>
                {song.title}
              </button>
            ))}
          </div>
        </div> */}
      </>
    );
  }
  // 再生画面
  else {
    return (
      <>
        <div className="control-box">
              {props.player && props.app && (
                <PlayerControl disabled={props.app.managed} player={props.player} handOverIsMapMove={props.handOverIsMapMove} hoverHistory={props.hoverHistory} mikuMile={props.mikuMile} lyricPhrase={props.lyricPhrase} songnum={props.songnum} jacketPic={getImage(props.songNumber)} songEnd={props.songEnd}
                />
              )}
        </div>
        {div}
      </>
    );
  }
}
