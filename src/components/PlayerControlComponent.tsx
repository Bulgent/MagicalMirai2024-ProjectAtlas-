import { useCallback, useState, useEffect, useRef } from 'react';
import { PlayerSeekbar } from 'textalive-react-api';
import '../styles/SongControl.css';
import { createElementFromHTML, msToMs } from '../utils/utils';
import { pngCar, svgStart, svgGoal } from '../assets/marker/markerSVG';
import { sightType } from '../utils/utils';

export const PlayerControl = (props: any) => {
  const [status, setStatus] = useState('stop');
  const isInitPlay = useRef(true);

  // 仮の曲の長さと現在の再生位置
  const songLength = props.player.data.song.length * 1000; // 5分 = 300秒
  const currentPosition = useRef(0); // 初期位置

  // 進行バーを更新する関数
  function updateProgressBar() {
    const progressBar = document.getElementsByClassName('progress-bar')[0];
    // console.log(progressBar)
    const percentage = (currentPosition.current / songLength) * 100;
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
  }

  if (currentPosition.current < songLength) {
    currentPosition.current = props.player.timer.position;
    updateProgressBar();
  }

  const FlagComponent = props.hoverHistory ? props.hoverHistory.map((hover: any, index: number) => {
    // console.log(hover.properties.playerPosition, hover.properties.event_type)
    let showSVG = ''
    const percentage = (hover.properties.playerPosition / songLength) * 100;
    switch (hover.properties.event_type) {
      case sightType.sports:
        showSVG = '🏟️'
        break;
      case sightType.eat:
        showSVG = '🍽'
        break;
      case sightType.movie:
        showSVG = '📽️'
        break;
      case sightType.aqua:
        showSVG = '🐬'
        break;
      case sightType.zoo:
        showSVG = '🦁'
        break;
      case sightType.depart:
        showSVG = '🏬'
        break;
      case sightType.castle:
        showSVG = '🏯'
        break;
      case sightType.hotspring:
        showSVG = '♨'
        break;
      case sightType.amusement:
        showSVG = '🎡'
        break;
      case sightType.festival:
        showSVG = '🎆'
        break;
      case sightType.factory:
        showSVG = '🏭'
        break;
      default:
        showSVG = '🏛'
    }

    return (
      <div key={index} className='flag-waypoint' style={{ width: `${percentage}%` }}>
        {showSVG}
      </div>
    )
  }) : 'のだた';

  const setButtonText = true ? '🔒' : '';

  useEffect(() => {
    const listener = {
      onPlay: () => setStatus('play'),
      onPause: () => setStatus('pause'),
      onStop: () => setStatus('stop'),
    };
    props.player.addListener(listener);
    return () => props.player.removeListener(listener);
  }, [props.player]);

  const handlePlay = useCallback(
    () => {
      if (props.player) {
        if (isInitPlay.current) {
          props.player.timer.seek(0);
          console.log("initialize playing")
          isInitPlay.current = false
        }
        props.player.requestPlay();
        props.handOverIsMapMove(true);
        console.log("playing");
      }
    },
    [props.player, props.handOverIsMapMove]
  );
  const handlePause = useCallback(
    () => {
      if (props.player) {
        props.player.requestPause();
        props.handOverIsMapMove(false);
        console.log("pause");
      }
    },
    [props.player, props.handOverIsMapMove]
  );

  return (
    <div className="songcontrol">
      <div className='left'>
        <div className='title-artist'>
          <div className='song-title'>
            {props.player.data.song.name}
          </div>
          <div className='song-artist'>
            {props.player.data.song.artist.name}
          </div>
        </div>
        <div className='seek'>
          {/* 元パステルにミクいろ */}
          <div className='seek-bar-container' style={{ width: '100%' }}>
            <div className='flags'>
              <div className='flag-start'>
                🚩
              </div>
              {FlagComponent}
              <div className='flag-end'>🏁</div>
            </div>
            <div className='progress-bar' style={{ width: '0%' }}>
              <div className='running-mm'>
                {props.mikuMile[0].toFixed(0)}
                <span className="unit">MM</span>
              </div>
              <img className='progress-handle' src='src\assets\images\carIcon_r.png' />
            </div>
          </div>
          {/* <PlayerSeekbar player={!props.disabled && props.player} /> */}
          <div className='song-time'>
            <div className="time-elapsed">
              {msToMs(props.player.timer.position)}
            </div>
            <div className="lyric-phrase">
              <div className="phrase-current">
                {props.lyricPhrase.text ? props.lyricPhrase?.text : props.player.video.firstPhrase.text}
              </div>
            </div>
            <div className="time-duration">
              {msToMs(props.player.data.song.length * 1000)}
            </div>
          </div>
        </div>

      </div>
      <div className='right'>
        <button className='pausebutton' onClick={status !== 'play' ? handlePlay : handlePause} disabled={props.disabled}>
          <img className='jacketbutton' src={props.jacketPic} alt={status !== 'play' ? 'Play' : 'Pause'} />
          <div className='textbutton'>
            <span className="material-symbols-outlined ppbutton">
              {status !== 'play' ? 'play_arrow' : 'pause'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
