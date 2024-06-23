import React from 'react';
import { useNavigate } from 'react-router-dom';
import songData from '../utils/Song';
import '../styles/App.css';
import '../styles/Welcome.css';
import { getImage } from '../utils/utils';
export const WelcomePage = () => {
    const navigate = useNavigate();

    const goToGamePage = (buttonInfo: number) => {
        navigate(`/navi?song=${buttonInfo}`); // GamePage へのパスとクエリパラメータを指定
    };

    return (
        <div id="display" className="soft-gloss">
            <div id="navi">
                <h1>Select Song</h1>
                <div className="grid-song">
                    {/* ボタンをsongData分追加 */}
                    {songData.map((song, index) => (
                        <button key={index} className='selectSong' onClick={() => goToGamePage(index)}>
                            <img src={getImage(index)} alt='' style={{width: '160px', height: '90px'}} />
                            <p>{song.title}</p>
                            <br/>
                            <p>{song.artist}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
