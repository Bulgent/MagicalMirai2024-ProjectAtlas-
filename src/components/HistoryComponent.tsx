import '../styles/App.css';
import '../styles/History.css';
import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { msToMs } from '../utils/utils';

export const HistoryComponent = (props: any) => {
    const [fanfun, setFanfun] = useState<number>(0);

    // ホバーされた情報表示
    const showHover = () => {
        if (props.hoverHistory.length === 0) {
            return (
                <div className='nohoverhistory'>
                    <div className='historyname'>
                        No Waypoint Arrived
                    </div>
                    <div className='historydetail'>
                        Please hover map icon
                    </div>
                </div>
            )
        }
        else {
            return (
                <>
                    {[...props.hoverHistory].reverse().map((hover: any, index: number) => (
                        <div key={index} className='historybox'>
                            <div className='historycaption'>
                                <div className='historyname'>
                                    {props.hoverHistory.length - index}
                                    -
                                    {hover.properties.event_place}
                                </div>
                                <div className='historytime'>
                                    {msToMs(hover.properties.playerPosition)}
                                </div>
                            </div>
                            <div className='historydetail'>
                                {hover.properties.event_detail}
                            </div>
                        </div>
                    ))}
                </>
            )
        }
    }

    // 曲読み込み済みか?
    if ((props.player) != null) {
        return (
            <div className='hover'>
                <div className='hovertext'>
                    Trip Memories
                    <div className='hoverline'></div>
                </div>
                <div className='hovercomponent' >
                    {showHover()}
                </div>
                <div className='hoverline'></div>
                <div className='fanfun' >
                    {props.fanfun}
                    {/* {String(props.fanfun).padStart(10, '0')} */}
                    <div className='fanfununit'>
                        F<span className='unit'>an</span>
                        <br />
                        F<span className='unit'>un</span>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            null
        )
    }
}
