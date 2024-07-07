import '../styles/App.css';
import '../styles/Result.css';
import { Navigate, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/utils';
import songData from '../utils/Song';
import creditData from '../utils/credits';
import { useState, useRef, useEffect } from 'react';
import { msToMs } from '../utils/utils';
import { sightEmoji } from '../utils/utils';

import { ResultIslandMapComponent } from '../components/ResultIslandMapComponent';
import { ResultDetailMapComponent } from '../components/ResultDetailMapComponent';

const enum sightType {
    sports = 0, // スポーツ
    eat = 1, // 食事
    movie = 2, // 映画館
    aqua = 3, // 水族館
    zoo = 4, // 動物園
    depart = 5, // 買い物
    castle = 6, // 史跡名勝
    hotspring = 7, // 温泉
    amusement = 8, // 遊園地
    festival = 9, // 祭り
    factory = 10, // 工場見学
    buil = 11 // その他
}

export const ResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // GamePageからのデータを取得
    const result = location.state; // GamePageからのデータを取得
    const [phrase, setPhrase] = useState<JSX.Element>(null)
    const [hashtag, setHashtag] = useState<string>(null)

    const FanFunCount = ({ result }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (count < result?.fanFun) {
                const timer = setTimeout(() => 
                    setCount(count + 1),
                 0.0001); // 20ミリ秒ごとにカウントアップ
                return () => clearTimeout(timer);
            }
        }, [count, result]);

        return (
            <>
                {count}
            </>
        );
    };


    const overviewPhrase = () => {
        // 一番多かった施設に対応する言葉
        const mostVisitedWord = [
            '健康的な汗を流しました。',
            '美味しい食事を堪能しました。',
            '迫力満点の映画に感動しました。',
            '海の生き物に癒されました。',
            '動物に癒されました。',
            '買い物三昧を堪能しました。',
            '歴史溢れる建築物を楽しみました。',
            'いい湯でリフレッシュしました。',
            'アトラクションで大興奮しました。',
            '地元の祭りに参加し大興奮しました。',
            '知的好奇心が刺激されました。',
            'その他の施設で'
        ];
        // 最高FanFunの施設に対応する言葉
        const bestFanFunWord = [
            'スポーツを楽しんで',
            '美味しい食事に舌鼓を打ち',
            '気になっていた映画を見ることができ',
            '色とりどりの魚に圧倒され',
            '動物たちと触れ合い',
            'ウィンドウショッピングで',
            '昔に思いを馳せ',
            'サウナで整い',
            '絶叫アトラクションでリフレッシュして',
            '飛び入り参加で祭りを盛り上げ',
            '多くの刺激的な知見を得ることができ',
            'その他の施設で'
        ];
        // UFOに遭遇した時の言葉
        const encountUfoWords = [
            'UFOを見つけられたのは、あなただけかもしれません! ',
            'UFOを見つけられたなんて、すごいです! ',
            'UFOを見つけられたなんて、不思議な体験でしたね! ',
            'UFOを見つけられたなんて、驚きです! ',
        ]
        // 励ましの言葉
        const encouragementWords = [
            '人生の旅路でも、わくわくするような新しい体験を大切にしたいですね!',
            'これからも、楽しい旅を続けていきましょう!',
            '次の旅も、楽しい思い出がたくさんできるといいですね!',
        ];

        // 施設の種類ごとのカウント
        let sightCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        // 最もFanFunが高い場所
        let bestFanFun = { name: '', score: 0, type: 0 }
        // hoverhistory の 同じ event_typeをカウント
        result?.hoverHistory.forEach((history) => {
            // 施設の種類ごとにカウント
            sightCount[history.properties.event_type] += 1;
            // FanFunが最も高い場所を記録
            if (bestFanFun.score < history.properties.fanfun_score) {
                bestFanFun.name = history.properties.event_place;
                bestFanFun.score = history.properties.fanfun_score;
                bestFanFun.type = history.properties.event_type;
            }
        });
        console.log(sightCount)
        // 最も訪れた場所（同率の場合は配列で）
        let mostVisited = [];
        let maxCount = Math.max(...sightCount);
        sightCount.forEach((count, index) => {
            if (count === maxCount) {
                mostVisited.push(index);
            }
        });

        // 概要文
        const overviewSong =
            result?.player.data.song.artist.name + 'の'+
            result?.player.data.song.name + 'を聴きながら旅を楽しみました。' 
        const overviewHistory = mostVisited.length > 0 ?
            '今回の旅では' + sightEmoji(mostVisited[0]).type
            + 'へよく訪れ、' +
            mostVisitedWord[mostVisited[0]]  : '';
        const overviewFanfun =
            '特に' + bestFanFun.name + 'では、' +
            bestFanFunWord[bestFanFun.type] + '、楽しい思い出をたくさん作ることができました。';
        const randomIndex = Math.floor(Math.random() * encouragementWords.length);
        const overviewEnd = encouragementWords[randomIndex];

        return (
            <>
                {overviewSong} <br />
                {overviewHistory} <br />
                {overviewFanfun} <br />
                {result?.encountUfo ? encountUfoWords[Math.floor(Math.random() * encountUfoWords.length)] : ''}
                {overviewEnd}
            </>
        );
    };



    const overviewHashtag = () => {
        // 施設の種類ごとのカウント
        let sightCount = [
            { type: sightType.sports, count: 0 },
            { type: sightType.eat, count: 0 },
            { type: sightType.movie, count: 0 },
            { type: sightType.aqua, count: 0 },
            { type: sightType.zoo, count: 0 },
            { type: sightType.depart, count: 0 },
            { type: sightType.castle, count: 0 },
            { type: sightType.hotspring, count: 0 },
            { type: sightType.amusement, count: 0 },
            { type: sightType.festival, count: 0 },
            { type: sightType.factory, count: 0 },
            { type: sightType.buil, count: 0 }
        ];
        // hoverhistory の 同じ event_typeをカウント
        result?.hoverHistory.forEach((history) => {
            // 施設の種類ごとにカウント
            sightCount[history.properties.event_type].count += 1;
        });
        // 最も訪れた場所（同率の場合は配列で）
        let mostVisited = [];
        let maxCount = Math.max(...sightCount.map((sight) => sight.count));
        sightCount.forEach((sight) => {
            if (sight.count === maxCount) {
                mostVisited.push(sight.type);
            }
        });
        // sightcount のカウントが1以上のやつに対してハッシュタグをつける
        let hashtag = '';
        sightCount.forEach((sight) => {
            if (sight.count > 0) {
                hashtag += sightEmoji(sight.type).hashtag + ' ';
            }
        });


        const ufoHashtag = [
            '#UFO',
            '#遭遇',
            '#エイリアン',
            '#宇宙人',
            '#未確認飛行物体',
            '#未知との遭遇',
            '#UMA発見!?',
        ]

        if (result?.encountUfo) {
            hashtag += ufoHashtag[Math.floor(Math.random() * ufoHashtag.length)] + ' ';
        }
        hashtag += '# ' + result?.player.data.song.name + ' #マジカルミライ';
        return hashtag;
    }

    useEffect(() =>{
        if (!phrase && !hashtag){
            setPhrase(overviewPhrase())
            setHashtag(overviewHashtag())
        }
    },[])

    return (
        <div id="display" className="soft-gloss">
            <div id="navi" className="split">
                <div className="result-split">
                    <div className='result-left'>
                        {/* 左画面 */}
                        {/* <div className='island-map'>
                            <ResultIslandMapComponent
                                pathway={result.pathway}
                            />
                        </div> */}
                        <div className='detail-map'>
                            <ResultDetailMapComponent
                                pathway={result.pathway}
                                hoverHistory={result.hoverHistory}
                            />
                        </div>
                        {/* <div className='result-songtitle'>
                            {result?.player.data.song.name}
                        </div> */}
                    </div>
                    <div className='result-right'>
                        {/* 右画面 */}
                        {/* <div className='result-title'>
                            Results
                        </div> */}
                        <div className='fanfun-title'>
                            FanFun Score
                            <div className='fanfun-score'>
                                {/* {result?.fanFun} */}
                                <FanFunCount result={result} />
                                <span className='unit'>FF</span>
                            </div>
                            <div className='mm-waypoint'>
                                <div className='mikumile-title'>
                                    Drive:
                                    <span className='mikumile-score'>
                                        {(result?.mikuMile[1] / 1000).toFixed(2)}
                                        <span className='unit'>kMM</span>
                                    </span>
                                </div>
                                <div className='waypoint-title'>
                                    Waypoint:
                                    <span className='waypoint-score'>
                                        {result?.hoverHistory.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='result-overview'>
                            <div className='result-hole' />
                            <div className='overview-tag'>
                                <div className='overview-title'>
                                    Overview of Your Trip
                                </div>
                                <div className='overview-contents'>
                                    {phrase}
                                </div>
                                <div className='overview-hashtag'>
                                    {hashtag}
                                </div>
                            </div>
                        </div>
                        <div className='result-button' onClick={() => { navigate('/') }}>
                            Go to Next Trip...
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <img id='logo' src='src/assets/images/logo.png' alt='' />
        </div >
    );
};
