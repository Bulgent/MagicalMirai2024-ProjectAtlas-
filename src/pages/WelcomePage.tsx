import '../styles/App.css';
import '../styles/Welcome.css';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import creditData from '../utils/credits';
import { useState, useRef } from 'react';
import { msToMs } from '../utils/utils';


export const WelcomePage = () => {
    const songIndex = useRef(-1);
    const [songTitle, setSongTitle] = useState<string>('MAGICAL MIRAI');
    const [songArtist, setSongArtist] = useState<string>('Programming Contest');
    const [songVocaloid, setSongVocaloid] = useState<string>('FAN FUN TRIP NAVIGATION');
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

    // 画面の向きが変わった時の処理
    window.addEventListener('resize', function () {
        const rotateDeviceElement = document.querySelector('.rotate-device') as HTMLDivElement;
        if (rotateDeviceElement) { // nullでないことを確認
            if (window.matchMedia("(orientation: portrait)").matches) {
                // 縦向きの場合
                rotateDeviceElement.style.display = 'block';
            } else {
                // 横向きの場合
                rotateDeviceElement.style.display = 'none';
            }
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
                        <img className='selectJacket' src={songIndex.current != -1 ? getImage(songIndex.current) : 'src/assets/images/project.png'} alt='jacket' />
                        <div className='selectTitle'>
                            <span className="material-symbols-outlined title">
                                music_note
                            </span>
                            {songTitle}
                        </div>
                        <div className='selectArtist'>
                            <span className="material-symbols-outlined artist">
                                lyrics
                            </span>
                            {songArtist}
                        </div>
                        <div className='selectVocaloid'>
                            <span className="material-symbols-outlined vocaloid">
                                artist
                            </span>
                            {songVocaloid}
                        </div>
                        <div className='selectLength'>
                            <span className="material-symbols-outlined length">
                                timer
                            </span>
                            {msToMs(songLength)}
                        </div>
                        <div className='selectDifficulty'>
                            {(songIndex.current != -1) && Array.from({ length: songData[songIndex.current].difficulty }).map((_, index) => (
                                <span key={index} className="material-symbols-outlined difficulty">
                                    star
                                </span>
                            ))}
                            難易度は適当
                        </div>
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
