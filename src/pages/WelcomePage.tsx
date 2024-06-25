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

    const handleMouseEnter = (index: number) => {
        const selectJacket = document.querySelector('.selectJacket') as HTMLImageElement;
        const selectTitle = document.querySelector('.selectTitle') as HTMLDivElement;
        const selectArtist = document.querySelector('.selectArtist') as HTMLDivElement;
        const selectVocaloid = document.querySelector('.selectVocaloid') as HTMLDivElement;
        const selectLength = document.querySelector('.selectLength') as HTMLDivElement;

        selectJacket.src = getImage(index);
        selectTitle.textContent = `${songData[index].title}`;
        selectArtist.textContent = `${songData[index].artist}`;
        selectVocaloid.textContent = `${songData[index].vocaloid.japanese}`;
        const millisecondsToMinutesSeconds = (milliseconds: number | undefined) => {
            if (milliseconds === undefined) {
                return '0:00';
            } else {
                const totalSeconds = Math.floor(milliseconds / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        };
        selectLength.textContent = `${millisecondsToMinutesSeconds(songData[index].duration)}`;
    };

    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                {/* <h1>Select Song</h1> */}
                <div className="jacket-song">
                    <div className="grid-song">
                        {/* ボタンをsongData分追加 */}
                        {songData.map((song, index) => (
                            <button key={index} className='selectSong' onClick={() => goToGamePage(index)} onMouseEnter={() => handleMouseEnter(index)}>
                                {index + 1}.{song.title}
                            </button>
                        ))}
                    </div>
                    <div className='selectSongInfo'>
                        <img className='selectJacket' src={getImage(0)} alt='' />
                        <div className='selectTitle'>title</div>
                        <div className='selectArtist'>artist</div>
                        <div className='selectVocaloid'>vocaloid</div>
                        <div className='selectLength'>duration</div>
                    </div>
                </div>
            </div>
            <img id='logo' src='src/assets/images/logo.png' alt='' />
        </div>
    );
};
