import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import creditData from '../utils/credits';
import '../styles/App.css';
import '../styles/Welcome.css';
import { useState, useRef } from 'react';
import { msToMs } from '../utils/utils';

export const WelcomePage = () => {
    const songIndex = useRef(-1);
    const [songTitle, setSongTitle] = useState<string>('MAGICAL MIRAI');
    const [songArtist, setSongArtist] = useState<string>('Programming Contest');
    const [songVocaloid, setSongVocaloid] = useState<string>('Project ATLAS');
    const [songLength, setSongLength] = useState<number>(1224000);

    const navigate = useNavigate();

    // ゲームページに遷移する関数
    const goToGamePage = (buttonInfo: number) => {
        navigate(`/navi?song=${buttonInfo}`); // GamePage へのパスとクエリパラメータを指定
    };

    // マウスがボタンに乗った時の処理
    const handleMouseEnter = (index: number) => {
        songIndex.current = index;
        setSongTitle(songData[index].title);
        setSongArtist(songData[index].artist);
        setSongVocaloid(songData[index].vocaloid.japanese);
        setSongLength(songData[index].duration);
    };

    window.addEventListener('orientationchange', function () {
        if (window.orientation === 0) {
            // 縦向きの場合
            document.querySelector('.rotate-device').style.display = 'block';
        } else {
            // 横向きの場合
            document.querySelector('.rotate-device').style.display = 'none';
        }
    });

    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                <div className="rotate-device">
                    画面を横向きにしてください．
                    <br />
                    Please rotate the screen horizontally.
                </div>
                <div className="jacket-song">
                    <div className="grid-song">
                        <div className='select-song-text'>Select Song</div>
                        {/* ボタンをsongData分追加 */}
                        {songData.map((song, index) => (
                            <button key={index} className='select-song-button' onClick={() => goToGamePage(index)} onMouseEnter={() => handleMouseEnter(index)} onTouchStart={() => handleMouseEnter(index)}>
                                {index + 1}.{song.title}
                            </button>
                        ))}
                    </div>
                    <div className='selectSongInfo'>
                        <img className='selectJacket' src={songIndex.current != -1 ? getImage(songIndex.current) : 'src/assets/images/project.png'} alt='' />
                        <div className='selectTitle'>{songTitle}</div>
                        <div className='selectArtist'>{songArtist}</div>
                        <div className='selectVocaloid'>{songVocaloid}</div>
                        <div className='selectLength'>{msToMs(songLength)}</div>
                        <div className='tooltip-credit'>
                            {creditData.map((credit, index) => (
                                <div key={index} className='credit'>
                                    <a href={credit.link} target="_blank" rel="noopener noreferrer">{credit.name}{index != creditData.length - 1 ? ',' : null}</a>
                                    <span key={index} className='tooltiptext'>
                                        {credit.credit}{credit.link != '' ? ' (' + credit.link + ')' : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <img id='logo' src='src/assets/images/logo.png' alt='' />
        </div>
    );
};
