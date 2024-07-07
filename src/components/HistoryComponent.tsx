import '../styles/App.css';
import '../styles/History.css';
import { useState, useEffect } from 'react';
import { msToMs, sightEmoji, sightType } from '../utils/utils';
import { animationProperties } from '../types/types';

export const HistoryComponent = (props: any) => {
    const [animations, setAnimations] = useState<animationProperties[]>([]);

    // FanFun度のアニメーション
    useEffect(() => {
        const change = props.fanfun - (animations[animations.length - 1]?.value || 0);
        const newAnimation = {
            id: Date.now(),
            value: props.fanfun,
            display: true,
            change: change == 0 ? '' : `+${change}`,
        };

        setAnimations(prev => [...prev, newAnimation]);

        setTimeout(() => {
            setAnimations(prev => prev.map(anim =>
                anim.id === newAnimation.id ? { ...anim, display: false } : anim
            ));
        }, 200); // アニメーションの時間に合わせる
    }, [props.fanfun]);

    // ホバーされた情報表示
    const showHover = () => {
        if (props.hoverHistory.length === 0) {
            return (
                <>
                    <div className='nohoverhistory' data-tooltip="地図上のアイコンをクリック">
                        <div className='nohistoryname'>
                            No Waypoint Arrived
                        </div>
                        <div className='nohistorydetail'>
                            Please click map icon
                        </div>
                    </div>
                    <div className="history-emoji">
                        {Array.from({ length: sightType.buil }, (_, index) => (
                            <span key={`emoji-${index}`} className='emoji-icon' data-tooltip={sightEmoji(index).type}>
                                {sightEmoji(index).emoji}
                            </span>
                        ))}
                    </div>
                </>
            )
        }
        else {
            return (
                <>
                    {props.songEnd && (<>
                        <div className='historyroad' />
                        <div className='historybox'>
                            <div className='historycaption'>
                                <div className='historyname'>
                                    <span>{props.hoverHistory.length}</span>
                                    -
                                    <span className='history-place'>インテックスオオサカ</span>
                                </div>
                                <div className='historytime'>
                                    {msToMs(props.player.data.song.length * 1000)}
                                </div>
                            </div>
                            <div className='historydetail'>
                                マジカルミライ オオサカ公演!
                            </div>
                        </div>
                    </>)}
                    {[...props.hoverHistory].reverse().map((hover: any, index: number) => {
                        // ここでhover.properties.event_idなど一意のプロパティをkeyとして使用
                        return (
                            <div key={`history-${hover.properties.index}`} className='historybox'>
                                <div className='historycaption'>
                                    <div className='historyname'>
                                        <span>{props.hoverHistory.length - index}</span>
                                        -
                                        <span className='history-place'>
                                            {hover.properties.event_place}
                                        </span>
                                    </div>
                                    <div className='historytime'>
                                        {msToMs(hover.properties.playerPosition)}
                                    </div>
                                </div>
                                <div className='historydetail'>
                                    {hover.properties.event_title}
                                </div>
                                <div className='historypoint'>
                                    +{hover.properties.fanfun_score} FanFun
                                </div>
                                <div className='historyroad' />
                            </div>
                        )
                    })}
                </>
            )
        }
    }

    // 曲読み込み済みか?
    if ((props.player) != null) {
        return (
            <div className='hover'>
                <div className='hovertext' data-tooltip="旅の思い出">
                    Trip Memories
                    <div className='hoverline' />
                </div>
                <div className='hovercomponent' >
                    {/* <img className='historycar' src='src\assets\images\carIcon.png' /> */}
                    {showHover()}
                </div>
                <div className='hoverline' />
                <div className='fanfun' data-tooltip="FanFun度">
                    {animations.map((anim) =>
                        <div key={anim.id} className={`fanfunChange ${!anim.display ? 'fade-out-up-animation' : ''}`}>
                            {anim.change}
                        </div>
                    )}
                    {props.fanfun}
                    {/* {String(props.fanfun).padStart(10, '0')} */}
                    <div className='fanfununit'>
                        F<span className='unit'>an</span>
                        <br />
                        F<span className='unit'>un</span>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            null
        )
    }
}
