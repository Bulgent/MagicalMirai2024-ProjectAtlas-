import './App.css';
import { useCallback, useState, useEffect } from 'react';

export const HistoryComponent = ({ player }) => {
    const [status, setStatus] = useState('stop');

    useEffect(() => {
        // const listener = {
        //   onPlay: () => setStatus('play'),
        //   onPause: () => setStatus('pause'),
        //   onStop: () => setStatus('stop'),
        // };
        // player.addListener(listener);
        return () => {
            console.log(player);
        };
      }, [player]);
    return(
        <></>
    )
}
