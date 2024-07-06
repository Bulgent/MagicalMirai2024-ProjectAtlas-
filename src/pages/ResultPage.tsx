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

import { ResultMapComponent } from '../components/ResultMapComponent';

// GamePageからのなんのデータがほしいかを書いといてください．

export const ResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // GamePageからのデータを取得
    const result = location.state; // GamePageからのデータを取得
    console.log(result);

    const overviewString = () => {
        const song = {
            name: result?.player.data.song.name,
            artist: result?.player.data.song.artist.name,
            duration: result?.player.data.song.duration,
        };
        const history = {
            hoverHistory: result?.hoverHistory,
            mostVisited: result?.mostVisited,
            highFanFun: result?.highFanFun,
        }
        
    };

    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                <div className="result-split">
                    <div className='result-left'>
                        {/* 左画面 */}
                        <ResultMapComponent />
                        <div className='result-songtitle'>
                            {result?.player.data.song.name}
                        </div>
                    </div>
                    <div className='result-right'>
                        {/* 右画面 */}
                        {/* <div className='result-title'>
                            Results
                        </div> */}
                        <div className='fanfun-title'>
                            FanFun Score
                            <div className='fanfun-score'>
                                {result?.fanFun}
                                <span className='unit'>FF</span>
                            </div>
                            <div className='mm-waypoint'>
                                <div className='mikumile-title'>
                                    Drive:
                                    <span className='mikumile-score'>
                                        {(result?.mikuMile[1] / 1000).toFixed(2)}
                                        <span className='unit'>kMM</span>
                                    </span>
                                </div>
                                <div className='waypoint-title'>
                                    Waypoint:
                                    <span className='waypoint-score'>
                                        {result?.hoverHistory.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='result-overview'>
                            <div className='overview-tag'>
                                <div className='overview-title'>
                                    Overview of Your Trip
                                </div>
                                <div className='overview-contents'>
                                    {result?.player.data.song.name}を聴きながら、{result?.player.data.song.artist.name}の楽曲に合わせて旅を楽しむことができました。
                                    <br />
                                    今回の旅では🦁動物園によく立ち寄り、動物たちの可愛らしい姿を楽しみました 。
                                    <br />
                                    特に大阪城では、歴史に触れながら楽しい思い出をたくさん作ることができました。
                                    <br />
                                    人生の旅路でも、わくわくするような新しい体験を大切にしたいですね!
                                </div>
                                <div className='overview-hashtag'>
                                    #MikuMile #FanFun
                                </div>
                            </div>
                        </div>
                        <div className='result-button' onClick={() => { navigate('/') }}>
                            Go to Next Trip...
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <img id='logo' src='src/assets/images/logo.png' alt='' />
        </div >
    );
};
