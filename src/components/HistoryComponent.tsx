import '../styles/App.css';
import '../styles/History.css';
import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { msToMs } from '../utils/utils';

export const HistoryComponent = (props: any) => {
    // ホバーされた情報表示
    const showHover = () => {
        if (props.hoverHistory.length === 0) {
            return (
                <div className='hoverhistory'>
                    <div className='historyname'>
                        No Waypoint
                    </div>
                    <div className='historydetail'>
                        Please hover over the map
                    </div>
                </div>
            )
        }
        else {
            return (
                <>{[...props.hoverHistory].reverse().map((hover: any, index: number) => (
                    <div key={index} className='hoverhistory'>
                        <div className='historyname'>
                            {props.hoverHistory.length - index}-
                            {/* {hover.properties.index} */}
                            {hover.properties.event_place}
                        </div>
                        <div className='historydetail'>
                            {hover.properties.event_detail}
                        </div>
                    </div>
                ))}</>
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
                <div className='funfun' >
                    FUNFUN SCORE
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
