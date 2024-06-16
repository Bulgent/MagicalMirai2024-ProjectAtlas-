import React from 'react';
import { useNavigate } from 'react-router-dom';
import songData from '../utils/Song';
export const WelcomePage = () => {
    const navigate = useNavigate();

    const goToGamePage = (buttonInfo: number) => {
        navigate(`/navi?song=${buttonInfo}`); // GamePage へのパスとクエリパラメータを指定
    };

    return (
        <div id="display" className="soft-gloss">
            <div id="navi">
                <h1>Select Song</h1>
                {/* ボタンをsongData分追加 */}
                {songData.map((song, index) => (
                    <button key={index} onClick={() => goToGamePage(index)}>
                        {song.title} / {song.artist}
                    </button>
                ))}
            </div>
        </div>
    );
};