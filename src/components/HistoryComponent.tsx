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

    const setDynamicFontSize = (eventPlace: string) => {
        let fontGain = 0.11;
        // console.log(eventPlace.length * fontGain)
        document.documentElement.style.setProperty('--dynamic-font-size', (eventPlace.length * fontGain).toString());
    };

    // ホバーされた情報表示
    const showHover = () => {
        if (props.hoverHistory.length === 0) {
            return (
                <>
                    <div className='nohoverhistory' data-tooltip="地図上の経由地をホバー/タップ">
                        <div className='historyname'>
                            No Waypoint Arrived
                        </div>
                        <div className='historydetail'>
                            Please hover or tap map icon
                        </div>

                    </div>
                    <div className="history-emoji">
                        {Array.from({ length: sightType.buil }, (_, index) => (
                            <span key={index} className='emoji-icon' data-tooltip={sightEmoji(index).type}>{sightEmoji(index).emoji}</span>
                        ))}
                    </div>
                </>
            )
        }
        else {
            return (
                <>
                    {[...props.hoverHistory].reverse().map((hover: any, index: number) => {
                        setDynamicFontSize(hover.properties.event_place);
                        return (
                            <div key={index} className='historybox'>
                                <div className='historycaption'>
                                    <div className='historyname'>
                                        <span>{props.hoverHistory.length - index}</span>
                                        -
                                        <span className='history-place'>{hover.properties.event_place}</span>
                                    </div>
                                    <div className='historytime'>
                                        {msToMs(hover.properties.playerPosition)}
                                    </div>
                                </div>
                                <div className='historydetail'>
                                    {hover.properties.event_detail}
                                </div>
                                <div className='historypoint'>
                                    +{hover.properties.want_score} FanFun
                                </div>
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
                    <div className='hoverline'></div>
                </div>
                <div className='hovercomponent' >
                    {showHover()}
                </div>
                <div className='hoverline'></div>
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
