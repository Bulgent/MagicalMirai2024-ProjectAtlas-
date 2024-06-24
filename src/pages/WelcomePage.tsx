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
            <div id="navi">
                <h1>Select Song</h1>
                <div className="grid-song">
                    {/* ボタンをsongData分追加 */}
                    {songData.map((song, index) => (
                        <button key={index} className='selectSong' onClick={() => goToGamePage(index)}>
                            <img className='selectJacket' src={getImage(index)} alt='' />
                            <div className='selectSongInfo'>
                                <div className='selectSongTitle'>{song.title}</div>
                                <div className='selectSongArtist'>{song.artist}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
