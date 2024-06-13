import { useCallback, useState, useEffect } from 'react';
import { PlayerSeekbar } from 'textalive-react-api';

export const PlayerControl = (props:any) => {
  const [status, setStatus] = useState('stop');

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
    () => props.player && props.player.requestPlay(),
    [props.player]
  );
  const handlePause = useCallback(
    () => props.player && props.player.requestPause(),
    [props.player]
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
