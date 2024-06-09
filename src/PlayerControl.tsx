import { useCallback, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { Color } from 'textalive-app-api';
import { Player } from 'textalive-app-api';
import { PlayerSeekbar } from 'textalive-react-api';

export const PlayerControl = ({ disabled, player }) => {
  const [status, setStatus] = useState('stop');
  // console.log(player.data.songMap)

  useEffect(() => {
    const listener = {
      onPlay: () => setStatus('play'),
      onPause: () => setStatus('pause'),
      onStop: () => setStatus('stop'),
    };
    player.addListener(listener);
    return () => player.removeListener(listener);
  }, [player]);

  const handlePlay = useCallback(
    () => player && player.requestPlay(),
    [player]
  );
  const handlePause = useCallback(
    () => player && player.requestPause(),
    [player]
  );
  const handleStop = useCallback(
    () => player && player.requestStop(),
    [player]
  );
  return (
    <div className="songcontrol">
      <div className="seekbar">
        <PlayerSeekbar player={!disabled && player}  />
      </div>
      <div className="pausebutton">
        <input type="button"
          value={status !== 'play' ? '▷' : '❘❘'}
          onClick={status !== 'play' ? handlePlay : handlePause}
          // size="small"
          disabled={disabled}
        />
      </div>
      {/* <Button
        content="停止"
        onClick={handleStop}
        size="small"
        disabled={disabled || status === 'stop'}
      /> */}
    </div>
  );
};
