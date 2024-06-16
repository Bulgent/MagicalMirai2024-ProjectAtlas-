import { useCallback, useState, useEffect ,useRef} from 'react';
import { PlayerSeekbar } from 'textalive-react-api';

export const PlayerControl = (props:any) => {
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
        if(isInitPlay.current){
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
      <div className="seekbar">
        <PlayerSeekbar player={!props.disabled && props.player}  />
      </div>
      <div className="pausebutton">
        <input type="button"
          value={status !== 'play' ? '▷' : '❘❘'}
          onClick={status !== 'play' ? handlePlay : handlePause}
          // size="small"
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};
