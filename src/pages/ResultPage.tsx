import '../styles/App.css';
import '../styles/Result.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import creditData from '../utils/credits';
import { useState, useRef } from 'react';
import { msToMs } from '../utils/utils';

// GamePageからのなんのデータがほしいかを書いといてください．

export const ResultPage = () => {
    const location = useLocation();
    // GamePageからのデータを取得
    const result = location.state;
    console.log(result);

    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                <div className='apologize'>
                    お疲れ様でした
                    <br />
                    FanFunScore:{result.fanFun}
                    <br />
                    hoverHistory:{result.hoverHistory.map((hover: any) => {
                        return <>{hover.properties.event_place} <br /></>
                    })
                    }
                    mikuMile:{result.mikuMile[1]}MM
                </div>
            </div>
            <img id='logo' src='src/assets/images/logo.png' alt='' />
        </div>
    );
};
