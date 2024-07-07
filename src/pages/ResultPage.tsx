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
import { escape } from 'querystring';

// GamePageからのなんのデータがほしいかを書いといてください．

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
    // console.log(result);

    const FanFunCount = ({ result }) => {
        const [count, setCount] = useState(0);
        // 目標値に到達するまでのインターバルを計算
        const fanfuncount = result.fanFun / 300; // 10秒で完了するように調整

        useEffect(() => {
            if (result?.fanFun > 0 && count < result.fanFun) {

                const timer = setTimeout(() =>
                    setCount(count + fanfuncount),
                    1); // 計算したインターバルでカウントアップ
                return () => clearTimeout(timer);
            }
        }, [count, result]);

        if (count >= result.fanFun) {
            return (
                <>{result.fanFun.toFixed(0)}</>
            );
        }

        return (
            <>
                {(count).toFixed(0)}
            </>
        );
    };


    const overviewPhrase = () => {
        // 一番多かった施設に対応する言葉
        const mostVisitedWord = [
            '汗を書きながらも',
            '美味しい食事を',
            '迫力満点の映画',
            '海の生き物に癒され',
            '動物たちと触れ合い',
            'お買い物三昧で',
            '歴史を感じて',
            'いい湯でリフレッシュし',
            'アトラクションで大興奮し',
            '地元の祭りに参加し',
            '工場見学で新しい発見をし',
            'その他の施設で'
        ];
        // 最高FanFunの施設に対応する言葉
        const bestFanFunWord = [
            'スポーツを楽しんで',
            '美味しい食事を堪能して',
            '映画を観て',
            'お魚さんたちに癒され',
            '動物たちと触れ合い',
            'お買い物三昧で',
            '歴史を感じて',
            'いい湯でリフレッシュし',
            'アトラクションで大興奮し',
            '地元の祭りに参加し',
            '流れ行く製品に感動し',
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
            '旅の疲れは、新たな発見で癒されますね。',
            '一歩一歩踏み出す勇気が、素晴らしい旅を作ります。',
            '旅は心を豊かにし、新たな自分を発見させてくれます。',
            'どんな旅も、あなたを成長させる貴重な経験です。',
            '旅の終わりは、新たな始まりのサインです。',
            '旅路での出会いと経験は、一生の宝物です。',
            '旅を通じて、世界の広さと自分の可能性を知ることができます。',
            '旅は、人生の冒険です。',
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
        // 一つも訪れていない場合を追加 
        if (sightCount.every((count) => count === 0)) {
            return (
                '今回の旅は、どこも立ち寄らずに終わりました。' + encouragementWords[Math.floor(Math.random() * encouragementWords.length)]
            );
        } else {
        // console.log(sightCount)
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
            result?.player.data.song.name + 'を聴きながら、' +
            result?.player.data.song.artist.name + 'の楽曲に合わせて旅を楽しむことができました。';
        const overviewHistory = mostVisited.length > 0 ?
            '今回の旅では' + sightEmoji(mostVisited[0]).type
            + 'によく立ち寄り、' +
            mostVisitedWord[mostVisited[0]] + '堪能しました。' : '';
        const overviewFanfun =
            '特に' + bestFanFun.name + 'では、' +
            bestFanFunWord[bestFanFun.type] + '旅の充実感を高めることができました。';
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
    }
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
        // 一つも訪れていない場合を追加 
        if (sightCount.every((sight) => sight.count === 0)) {
            return '# 猪突猛進 # ' + result?.player.data.song.name + ' #マジカルミライ';
        } else {
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
                '未知との遭遇',
                'UMA発見!?',
            ]

            if (result?.encountUfo) {
                hashtag += ufoHashtag[Math.floor(Math.random() * ufoHashtag.length)] + ' ';
            }
            hashtag += '# ' + result?.player.data.song.name + ' #マジカルミライ';
            return hashtag;
        }
    }

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
                        <ResultDetailMapComponent
                            pathway={result.pathway}
                            hoverHistory={result.hoverHistory}
                        />
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
                                    {'Drive: '}
                                    <span className='mikumile-score'>
                                        {(result?.mikuMile[1] / 1000).toFixed(2)}
                                        <span className='unit'>{' kMM'}</span>
                                    </span>
                                </div>
                                <div className='waypoint-title'>
                                    {'Waypoint: '}
                                    <span className='waypoint-score'>
                                        {result?.hoverHistory.length}
                                        <span className='unit'>{' spot'}</span>
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
                                    {overviewPhrase()}
                                </div>
                                <div className='overview-hashtag'>
                                    {overviewHashtag()}
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
