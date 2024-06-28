import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import creditData from '../utils/credits';
import '../styles/App.css';
import '../styles/Welcome.css';
import { useState } from 'react';
import { msToMs } from '../utils/utils';

export const WelcomePage = () => {
    const [songIndex, setSongIndex] = useState(-1);
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
        setSongIndex(index);
        setSongTitle(songData[index].title);
        setSongArtist(songData[index].artist);
        setSongVocaloid(songData[index].vocaloid.japanese);
        setSongLength(songData[index].duration);
    };

    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                <div className="jacket-song">
                    <div className="grid-song">
                        <div className='select-song-text'>Select Song</div>
                        {/* ボタンをsongData分追加 */}
                        {songData.map((song, index) => (
                            <button key={index} className='select-song-button' onClick={() => goToGamePage(index)} onMouseEnter={() => handleMouseEnter(index)}>
                                {index + 1}.{song.title}
                            </button>
                        ))}
                    </div>
                    <div className='selectSongInfo'>
                        <img className='selectJacket' src={songIndex != -1 ? getImage(songIndex) : 'src/assets/images/project.png'} alt='' />
                        <div className='selectTitle'>{songTitle}</div>
                        <div className='selectArtist'>{songArtist}</div>
                        <div className='selectVocaloid'>{songVocaloid}</div>
                        <div className='selectLength'>{msToMs(songLength)}</div>
                        <div className='tooltip'>
                            {creditData.map((credit, index) => (
                                <div key={index} className='credit'>
                                    <a href={credit.link} target="_blank" rel="noopener noreferrer">{credit.name}</a>
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
