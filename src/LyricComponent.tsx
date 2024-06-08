import { useState, useEffect, useMemo } from 'react';
import { Player } from 'textalive-app-api';
import { PlayerControl } from './PlayerControl';
import songRead from './song_data/Song';
import './App.css';

//   onAppReady, // APIの準備完了
//   onVideoReady, // 楽曲情報取得完了
//   onTimerReady, // 再生準備完了
//   onTimeUpdate, // 再生位置変更
//   onThrottledTimeUpdate, // 動画再生位置変更
//   onPlay, // 楽曲再生時
//   onPause, // 楽曲一時停止時
//   onStop, // 楽曲停止時
//   onAppMediaChange, // 楽曲変更時



export const LyricComponent = (props: any) => {
  // 開発環境稼働か?
  // const isDevelopment: boolean = false;
  const isDevelopment: boolean = process.env.NODE_ENV === 'development';

  const [player, setPlayer] = useState(null);
  const [app, setApp] = useState(null); //
  const [playTime, setPlayTime] = useState(0)
  const [songLength, setSongLength] = useState(0)
  // const [char, setChar] = useState(''); // 歌詞情報
  const [chord, setChord] = useState(''); // コード情報
  // const [chorus, setChorus] = useState('');
  const [volume, setVolume] = useState(50);
  const [songNum, setSongNum] = useState(isDevelopment ? 3 : -1) //選択曲 -1:未選択 開発環境なら曲選択をすっ飛ばしてマップ画面に行く
  const [mediaElement, setMediaElement] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');

  // 選択された曲のジャケット画像のパス取得
  const getImage = (): string => {
    return new URL(`./song_data/jacket/${songRead[songNum].jacketName}`, import.meta.url).href;
  };

  // 同じ値のときは再計算せずにいいヤツ
  const div = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );

  // 関数実行をReactのレンダリング後まで遅らせるやつ(上のdivが描画されるまで待機)
  useEffect(() => {
    // 曲選択前または画面描画前のときはエラーが出るのでスキップ
    if (songNum < 0 || typeof window === 'undefined' || !mediaElement) {
      return;
    }
    console.log('--- [app] create Player instance ---');
    const p = new Player({
      app: {
        token: 'elLljAkPmCHHiGDP', // トークンは https://developer.textalive.jp/profile で取得したものを使う
      },
      mediaElement,
    });

    function getSegNumber(time: number) {
      const ans: number[] = [];
      for (let i = 0; i < p.data.songMap.segments.length; i++) {
        Array.from(p.data.songMap.segments[i].segments, (z) => {
          if (z.contains(time)) ans.push(i);
        });
      }
      return ans;
    }

    let prevBeatPosition = -1;

    // 曲イベント
    const playerListener = {
      onAppReady: (app) => {
        console.log('--- [app] initialized as TextAlive app ---');
        console.log('managed:', app.managed);
        // 選ばれた曲を読み込み
        console.log(isDevelopment ? "曲選択すっ飛ばし" : "曲選択画面")

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
        setApp(app);
      },
      onVideoReady: () => {
        console.log('--- [app] video is ready ---');
        console.log('player:', p);
        console.log('player.data.song:', p.data.song);
        console.log('読込曲:', p.data.song.name, " / ", p.data.song.artist.name);
        console.log('player.data.songMap:', p.data.songMap);
        setSongTitle(p.data.song.name)
        setSongArtist(p.data.song.artist.name)
        setSongLength(p.data.song.length)
        p.volume = volume
        props.handOverPlayer(p);
        props.handOverSongInfo(songNum)
        // 一番最初の文字
        let kashiChar = p.video.firstChar; // 最初の文字(好)
        let kashiWord = p.video.firstWord; // 最初の熟語(好き)
        let kashiPhrase = p.video.firstPhrase; // 最初の歌詞(好きの伝え方は一つじゃないから)
        // setChord(p.findChord(p.timer.position).name + " → " + p.findChord(p.timer.position).next.name);
        // setChorus(getSegNumber(now).join())
        console.log(kashiChar.text, kashiWord.text, kashiPhrase.text)
        // 今の歌詞と次の歌詞が存在する時はずっと繰り返す
        while (kashiPhrase && kashiPhrase.next) {
          let isFirstPhrase: boolean = true;
          // フレーズ
          kashiPhrase.animate = (nowPhrase, uPhrase) => {
            // 文字が時間内の時
            if (uPhrase.contains(nowPhrase) && isFirstPhrase) {
              // console.log(uPhrase.text)
              // 歌詞の更新

              props.handOverPhrase(uPhrase);   // 歌詞を親に渡す
              isFirstPhrase = false;
            }
          };
          kashiPhrase = kashiPhrase.next;  // 次の文字
        }
        // 最後の歌詞
        kashiPhrase = p.video.lastPhrase;
        kashiPhrase.animate = (nowPhrase, uPhrase) => {
          // 文字が時間内の時
          if (uPhrase.startTime <= nowPhrase && uPhrase.endTime > nowPhrase) {
            // console.log(uWord.text)
            // 歌詞の更新
            props.handOverPhrase(uPhrase); // 歌詞を親に渡す
          }
        };
        while (kashiWord && kashiWord.next) {
          let isFirstWord: boolean = true
          // 単語
          kashiWord.animate = (nowWord, uWord) => {
            // 文字が時間内の時
            if (uWord.startTime <= nowWord && uWord.endTime > nowWord && isFirstWord) {
              // console.log(uWord.text)
              // 歌詞の更新
              props.handOverWord(uWord); // 歌詞を親に渡す
              isFirstWord = false;
            }
          };
          kashiWord = kashiWord.next; // 次の文字
        }
        // 最後の歌詞
        kashiWord = p.video.lastWord;
        kashiWord.animate = (nowWord, uWord) => {
          // 文字が時間内の時
          if (uWord.startTime <= nowWord && uWord.endTime > nowWord) {
            // console.log(uWord.text)
            // 歌詞の更新
            props.handOverWord(uWord); // 歌詞を親に渡す
          }
        };

        while (kashiChar && kashiChar.next) {
          let isFirstChar: boolean = true;
          // 一字
          kashiChar.animate = (nowChar, uChar) => {
            // 文字が時間内の時
            if (uChar.startTime <= nowChar && uChar.endTime > nowChar && isFirstChar) {
              // 歌詞の更新
              // console.log(uChar.text)
              props.handOverChar(uChar);  // 歌詞を親に渡す
              isFirstChar = false;
            }
          };
          kashiChar = kashiChar.next;  // 次の文字
        }
        // 最後の歌詞
        kashiChar = p.video.lastChar;
        kashiChar.animate = (nowChar, uChar) => {
          // 文字が時間内の時
          if (uChar.startTime <= nowChar && uChar.endTime > nowChar) {
            // console.log(uWord.text)
            // 歌詞の更新
            props.handOverChar(uChar); // 歌詞を親に渡す
          }
        };
      },
      // 時間更新時
      onTimeUpdate: (position: number) => {
        setPlayTime(position);
        // コードの更新
        props.handOverChord(p.findChord(position).name);
        // ビートの更新
        const beat = p.findBeat(position);
        if (beat.position === prevBeatPosition) return;
        let beatText = '';
        for (let i = 0; i < beat.position; i++) {
          beatText += '* ';
        }
        props.handOverBeat(beatText);
        prevBeatPosition = beat.position;
        // コーラスの更新
        props.handOverChorus(p.findChorus(position));
      }
    };
    // イベント登録
    p.addListener(playerListener);

    // プレイヤー準備完了
    setPlayer(p);

    // 再生終了時
    return () => {
      console.log('--- [app] shutdown ---');
      p.removeListener(playerListener);
      p.dispose();
    };
  }, [mediaElement]);

  // 曲選択画面
  if (songNum < 0) {
    return (
      <>
        <div className='mediacircle'>
          <div className="media-jacket"></div>
          <div className="media-seek">
            <button type="button" onClick={() => setSongNum(0)}>SUPERHERO</button>
            <button type="button" onClick={() => setSongNum(1)}>いつか君と話したミライは</button>
            <button type="button" onClick={() => setSongNum(2)}>フューチャーノーツ</button>
            <button type="button" onClick={() => setSongNum(3)}>未来交響曲</button>
            <button type="button" onClick={() => setSongNum(4)}>リアリティ</button>
            <button type="button" onClick={() => setSongNum(5)}>The Marks</button>
          </div>
        </div>
      </>
    );
  }
  // 再生画面
  else {
    return (
      <>
        <div className='mediacircle'>
          <div className="media-seek">
            <div className='media-jacket transparent'>
              <img className='jacketpic' src={getImage()} alt='' />
            </div>
            <div className='media-info'>
              <div className='title-artist'>
                <div className='songtitle'>♪{songTitle}</div>
                <div className='songartist'>{songArtist}</div>
              </div>
              <div className='playartist'>
                <div className="time">
                  {('00' + Math.floor((playTime / 1000) / 60)).slice(-2)}:{('00' + Math.floor((playTime / 1000) % 60)).slice(-2)} / {('00' + Math.floor(songLength / 60)).slice(-2)}:{('00' + Math.floor(songLength % 60)).slice(-2)}
                </div>
              </div>
              <div className="controls">
                {player && app && (
                  <PlayerControl disabled={app.managed} player={player} />
                )}
              </div>
              {div}
            </div>
          </div>
        </div>
      </>
    );
  }
}
// export default LyricComponent;
