import '../styles/App.css';
import '../styles/Result.css';
import { Navigate, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import creditData from '../utils/credits';
import { useState, useRef } from 'react';
import { msToMs } from '../utils/utils';
import { sightEmoji } from '../utils/utils';

// GamePageからのなんのデータがほしいかを書いといてください．

export const ResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // GamePageからのデータを取得
    const result = location.state; // GamePageからのデータを取得
    console.log(result);

    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                <div className="result-split">
                    <div className='result-left'>
                        {/* 左画面 */}
                        <div className='result-songtitle'>
                            {result?.player.data.song.name}
                        </div>
                    </div>
                    <div className='result-right'>
                        {/* 右画面 */}
                        <div className='fanfun-title'>
                            FanFun Score
                            <div className='fanfun-score'>
                                {result?.fanFun}00
                            </div>
                        </div>
                        <div className='mm-waypoint'>
                            <div className='mikumile-title'>
                                MikuMile:
                                <span className='mikumile-score'>
                                    {result?.mikuMile[1]}MM
                                </span>
                            </div>
                            <div className='waypoint-title'>
                                Waypoint:
                                <span className='waypoint-score'>
                                    {result?.hoverHistory.length}00
                                </span>
                            </div>
                            <div className='waypoint-graph'>
                                {/* {result?.hoverHistory.map((hover: any, index: number) => {
                                    const percentage = (hover.properties.playerPosition / (result?.player.data.song.length * 1000)) * 100;
                                    return (
                                        <div key={index} className='flag-waypoint' style={{ width: `${percentage}%` }}>
                                            {sightEmoji(hover.properties.event_type).emoji}
                                        </div>
                                    )
                                })} */}
                            </div>
                        </div>
                        <div className='result-overview'>
                            <div className='overview-title'>
                                Overview of your trip
                            </div>
                            <div className='overview-contents'>
                                aa
                            </div>
                            <div className='overview-hashtag'>
                                #MikuMile #FanFun
                            </div>
                        </div>
                        <div className='result-button'>
                            <button className='back-button' onClick={() => { navigate('/') }}>Back</button>
                        </div>
                        {/* TODO hoverしたら詳細表示 */}
                        {/* hoverHistory:{result?.hoverHistory.map((hover: any) => {
                        return <>{hover.properties.event_place} <br /></>
                    })
                    } */}
                    </div>
                </div>
            </div>
            <img id='logo' src='src/assets/images/logo.png' alt='' />
        </div>
    );
};
