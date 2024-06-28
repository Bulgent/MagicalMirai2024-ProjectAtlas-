import { useCallback, useState, useEffect, useRef } from 'react';
import { PlayerSeekbar } from 'textalive-react-api';
import '../styles/SongControl.css';

export const PlayerControl = (props: any) => {
  const [status, setStatus] = useState('stop');
  const isInitPlay = useRef(true);

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
          <PlayerSeekbar player={!props.disabled && props.player} />
          <div className='song-time'>
            <div className="time-elapsed">
              {('00' + Math.floor((props.player.timer.position / 1000) / 60)).slice(-2)}:{('00' + Math.floor((props.player.timer.position / 1000) % 60)).slice(-2)}
            </div>
            <div className="lyric-phrase">
              <div className="phrase-current">
                {props.lyricPhrase.text ? props.lyricPhrase?.text : props.player.video.firstPhrase.text}
              </div>
            </div>
            <div className="time-duration">
              {('00' + Math.floor(props.player.data.song.length / 60)).slice(-2)}:{('00' + Math.floor(props.player.data.song.length % 60)).slice(-2)}
            </div>
          </div>
        </div>

      </div>
      <div className='right'>
        <button className='pausebutton' onClick={status !== 'play' ? handlePlay : handlePause} disabled={props.disabled}>
          <img className='jacketbutton' src={props.jacketPic} alt={status !== 'play' ? 'Play' : 'Pause'} />
          <div className='textbutton'>
            {status !== 'play' ? '▷' : '❘❘'}
          </div>
        </button>
      </div>
    </div>
  );
};
