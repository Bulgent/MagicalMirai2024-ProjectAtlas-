import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import '../styles/App.css';
import '../styles/Welcome.css';

export const WelcomePage = () => {
    const navigate = useNavigate();

    const goToGamePage = (buttonInfo: number) => {
        navigate(`/navi?song=${buttonInfo}`); // GamePage へのパスとクエリパラメータを指定
    };

    return (
            <div id="display" className="soft-gloss">
                <div id="navi" className="split">
                    {/* <h1>Select Song</h1> */}
                    <div className="jacket-song">
                        <div className="grid-song">
                            {/* ボタンをsongData分追加 */}
                            {songData.map((song, index) => (
                                <button key={index} className='selectSong' onClick={() => goToGamePage(index)}>
                                    <div className='selectSongInfo'>
                                        <div className='selectSongTitle'>{song.title}</div>
                                        <div className='selectSongArtist'>{song.artist}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <img className='selectJacket' src={getImage(0)} alt='' />
                    </div>
                </div>
                <img id='logo' src='src\assets\images\logo.png' alt='' />
            </div>
    );
};
