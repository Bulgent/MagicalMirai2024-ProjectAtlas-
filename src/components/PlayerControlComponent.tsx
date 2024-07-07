import { useCallback, useState, useEffect, useRef } from 'react';
import { PlayerSeekbar } from 'textalive-react-api';
import '../styles/SongControl.css';
import { msToMs, sightType, sightEmoji } from '../utils/utils';
import songData from '../utils/Song';

export const PlayerControl = (props: any) => {
  const [status, setStatus] = useState('stop');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isInitPlay = useRef(true);

  // 曲の長さと現在の再生位置
  const songLength = props.player.data.song.length * 1000; // 5分 = 300秒
  const currentPosition = useRef(0); // 初期位置

  // 進行バーを更新する関数
  function updateProgressBar() {
    const progressBar = document.getElementsByClassName('progress-bar')[0];
    // console.log(progressBar)
    const percentage = 100 - (currentPosition.current / songLength) * 100;
    if (progressBar) {
      /* @ts-ignore */
      progressBar.style.width = `${percentage}%`;
    }
  }

  if (currentPosition.current < songLength) {
    currentPosition.current = props.player.timer.position;
    updateProgressBar();
  }

  const FlagComponent = props.hoverHistory ? props.hoverHistory.map((hover: any, index: number) => {
    // console.log(hover.properties.playerPosition, hover.properties.event_type)
    const percentage = (hover.properties.playerPosition / songLength) * 100;
    const showSVG = sightEmoji(hover.properties.event_type).emoji;
    return (
      <div key={index} className='flag-waypoint' style={{ width: `${percentage}%` }}>
        {showSVG}
      </div>
    )
  }) : '';

  const GetWeather = () => {
    // morning{songData[props.songnum].turningPoint1![0]}
    const morningToNoon = {
      start: songData[props.songnum].turningPoint1![0],
      end: songData[props.songnum].turningPoint1![1]
    }
    const noonToNight = {
      start: songData[props.songnum].turningPoint2![0],
      end: songData[props.songnum].turningPoint2![1]
    }
    const current = props.player.timer.position
    // console.log(current, props.player.timer.position, props.player.video.duration)
    if (current < morningToNoon.start && !props.songEnd) {
      return ('Morning') // 朝
    } else if (current < morningToNoon.end && !props.songEnd) {
      return (<>
        Morning
        {/* <span className="material-symbols-outlined weather-arrow">
          double_arrow
        </span>
        🌞Noon */}
      </>) // 朝から昼
    } else if (current < noonToNight.start && !props.songEnd) {
      return ('Noon') // 昼
    } else if (current < noonToNight.end && !props.songEnd) {
      return (<>
        Noon
        {/* <span className="material-symbols-outlined weather-arrow">
          double_arrow
        </span>
        🌆🌇Night */}
      </>) // 昼から夜
    } else {
      return ('Night') // 夜
    }
  }

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
          // console.log("initialize playing")
          isInitPlay.current = false
        }
        props.player.requestPlay();
        props.handOverIsMapMove(true);
        // console.log("playing");
      }
    },
    [props.player, props.handOverIsMapMove]
  );
  const handlePause = useCallback(
    () => {
      if (props.player) {
        props.player.requestPause();
        props.handOverIsMapMove(false);
        // console.log("pause");
      }
    },
    [props.player, props.handOverIsMapMove]
  );

  const handleClick = () => {
    if (status !== 'play') {
      handlePlay();
    } else {
      handlePause();
    }
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 300); // 300ミリ秒後にボタンを再度有効にする
  };

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
          <div className='seek-bar-container'>
            <div className='running-mm'>
              {(props.mikuMile[0] / 1000).toFixed(1)}
              <span className="unit">kMM</span>
            </div>
            <div className='progress-weather'>
              <GetWeather />
            </div>
            <div className='flags'>
              <div className='flag-start'>🚩</div>
              {FlagComponent}
              <div className='flag-end'>🏁</div>
            </div>
            <div className='progress-bar' style={{ width: '100%' }}>
              <img className='progress-handle' src='\images\carIcon.png' />
            </div>
          </div>
          {/* <PlayerSeekbar player={!props.disabled && props.player} /> */}
          <div className='song-time'>
            <div className="time-elapsed">
              {msToMs(props.player.timer.position)}
            </div>
            <div className="lyric-phrase">
              <div className="phrase-current">
                {/* {props.lyricPhrase.text ? props.lyricPhrase?.text : props.player.video.firstPhrase.text} */}
                {props.lyricPhrase.text}
              </div>
            </div>
            <div className="time-duration">
              {msToMs(props.player.data.song.length * 1000)}
            </div>
          </div>
        </div>
      </div>
      <div className='right'>
        <button className='pausebutton' onClick={handleClick} disabled={props.disabled || isButtonDisabled || props.songEnd}>
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
