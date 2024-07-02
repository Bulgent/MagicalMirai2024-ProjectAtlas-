import '../styles/App.css';
import '../styles/Result.css';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import creditData from '../utils/credits';
import { useState, useRef } from 'react';
import { msToMs } from '../utils/utils';

// GamePageからのなんのデータがほしいかを書いといてください．

export const ResultPage = () => {
    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                <div className='apologize'>
                    お疲れ様でした
                </div>
            </div>
            <img id='logo' src='src/assets/images/logo.png' alt='' />
        </div>
    );
};
