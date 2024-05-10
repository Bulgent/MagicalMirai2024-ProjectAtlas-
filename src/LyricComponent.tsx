import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Player } from 'textalive-app-api';
import songRead from './data/Song';
import { PlayerControl } from './PlayerControl';

// player.addListener({
//   onAppReady, // APIの準備完了
//   onVideoReady, // 楽曲情報取得完了
//   onTimerReady, // 再生準備完了
//   onTimeUpdate, // 再生位置変更
//   onThrottledTimeUpdate, // 動画再生位置変更
//   onPlay, // 楽曲再生時
//   onPause, // 楽曲一時停止時
//   onStop, // 楽曲停止時
//   onAppMediaChange, // 楽曲変更時
// });

// TO DO
// 曲選択のボタン表示       ☑
// 押されるまで待機         ☑
// 押された曲データ読み込み ☒ Invalid hookエラーが出る
// 再生                     ☑

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

function LyricComponent(songNum : number) {
  const [player, setPlayer] = useState(null);
  const [app, setApp] = useState(null); //
  const [char, setChar] = useState(''); // 歌詞情報
  const [chord, setChord] = useState(''); // 歌詞情報
  //const [songNum, setSong] = useState(songNum);

  // const [fontFamily, setFontFamily] = useState(sansSerif);
  // const [fontSize, setFontSize] = useState(defaultFontSize);
  // const [color, setColor] = useState(defaultColor);
  // const [darkMode, setDarkMode] = useState(false);
  const [mediaElement, setMediaElement] = useState(null);

  // 同じ値のときは再計算せずにいいヤツ
  const div = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );

  // 関数実行をReactのレンダリング後まで遅らせるやつ(上のdivが描画されるまで待機)
  useEffect(() => {
    // 画面描画前のときはエラーが出るのでスキップ
    if (typeof window === 'undefined' || !mediaElement) {
      return;
    }

    console.log('--- [app] create Player instance ---');
    const p = new Player({
      app: {
        // トークンは https://developer.textalive.jp/profile で取得したものを使う
        token: 'elLljAkPmCHHiGDP',
      },
      mediaElement,
    });

    const playerListener = {
      onAppReady: (app) => {
        console.log('--- [app] initialized as TextAlive app ---');
        console.log('managed:', app.managed);
        console.log('host:', app.host);
        console.log('song url:', app.songUrl);
        if (!app.songUrl) {
          p.createFromSongUrl(songRead[songNum].songURL, {
            video: {
              // 音楽地図訂正履歴
              beatId: songRead[songNum].video.beatId,
              chordId: songRead[songNum].video.chordId,
              repetitiveSegmentId: songRead[songNum].video.repetitiveSegmentId,
              // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
              lyricId: songRead[songNum].video.lyricId,
              lyricDiffId: songRead[songNum].video.lyricDiffId,
            },
          });
        }
        setApp(app);
      },
      // onAppParameterUpdate: (name, value) => {
      //   console.log(`[app] parameters.${name} update:`, value);
      //   if (name === 'fontFamily') {
      //     setFontFamily(value);
      //   }
      //   if (name === 'fontSize') {
      //     setFontSize(value);
      //   }
      //   if (name === 'color') {
      //     const color = value;
      //     setColor(`rgb(${color.r}, ${color.g}, ${color.b})`);
      //   }
      //   if (name === 'darkMode') {
      //     setDarkMode(!!value);
      //   }
      // },
      onVideoReady: () => {
        console.log('--- [app] video is ready ---');
        console.log('player:', p);
        console.log('player.data.song:', p.data.song);
        console.log('player.data.song.name:', p.data.song.name);
        console.log('player.data.song.artist.name:', p.data.song.artist.name);
        console.log('player.data.songMap:', p.data.songMap);
        let c = p.video.firstChar;
        while (c && c.next) {
          c.animate = (now, u) => {
            if (u.startTime <= now && u.endTime > now) {
              setChar(u.text);
              console.log(p.findChord(p.timer.position).name)
              setChord(p.findChord(p.timer.position).name + " → " + p.findChord(p.timer.position).next.name);
            }
          };
          c = c.next;
        }
      },
      onAppMediaChange: (mediaUrl:string) => {
        console.log("新しい再生楽曲が指定されました:", mediaUrl);
      },
    };
    p.addListener(playerListener);



    setPlayer(p);
    return () => {
      console.log('--- [app] shutdown ---');
      p.removeListener(playerListener);
      p.dispose();
    };


  }, [mediaElement]);

  return (
    <>
      {player && app && (
        <div className="controls">
          <PlayerControl disabled={app.managed} player={player} />
        </div>
      )}
      <div
        className="wrapper"
        style={{
          background: '#fff',
        }}
      >
        <div className="char">{char}</div>
        <div className="chord">{chord}</div>
      </div>
      {/* <button type="button" onClick={() => handleChangeSong(0)}>SUPERHERO</button>
      <button type="button" onClick={() => handleChangeSong(1)}>いつか君と話したミライは</button>
      <button type="button" onClick={() => handleChangeSong(2)}>フューチャーノーツ</button>
      <button type="button" onClick={() => handleChangeSong(3)}>未来交響曲</button>
      <button type="button" onClick={() => handleChangeSong(4)}>リアリティ</button>
      <button type="button" onClick={() => handleChangeSong(5)}>The Marks</button> */}
      {div}
    </>
  );

  // return (
  //   <>
  //     {player && app && (
  //       <div className="controls">
  //         <PlayerControl disabled={app.managed} player={player} />
  //       </div>
  //     )}
  //     <div
  //       className="wrapper"
  //       style={{
  //         background: darkMode ? '#333' : '#fff',
  //       }}
  //     >
  //       <div
  //         className="char"
  //         style={{
  //           fontFamily,
  //           fontSize: `${fontSize}vh`,
  //           color,
  //         }}
  //       >
  //         {char}
  //       </div>
  //     </div>
  //     {div}
  //   </>
  // );
}
// export default LyricComponent;
export default SelectSongConponent;
