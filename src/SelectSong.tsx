import LyricComponent from './LyricComponent';

export function SelectSongConponent() {

    const handleChangeSong = (readSongNum: number) => {

        console.log(readSongNum);
        LyricComponent(readSongNum)
    };

    return (
        <>
            <button type="button" onClick={() => handleChangeSong(0)}>SUPERHERO</button>
            <button type="button" onClick={() => handleChangeSong(1)}>いつか君と話したミライは</button>
            <button type="button" onClick={() => handleChangeSong(2)}>フューチャーノーツ</button>
            <button type="button" onClick={() => handleChangeSong(3)}>未来交響曲</button>
            <button type="button" onClick={() => handleChangeSong(4)}>リアリティ</button>
            <button type="button" onClick={() => handleChangeSong(5)}>The Marks</button>
        </>
    );
}

export default SelectSongConponent;