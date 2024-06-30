import '../styles/MapInfo.css';
import { useState, useEffect } from 'react';
import { calculateZoom2MikuMile, msToMs } from '../utils/utils.ts'


export const MapInfoComponent = (props: any) => {
    const [zoomToMikuMile, setZoomToMikuMile] = useState<string>("0");

    useEffect(() => {
        const calculatedValue = calculateZoom2MikuMile(props.scale).toFixed(0);
        setZoomToMikuMile(calculatedValue);
    }, [props.scale]);
    // 表示する値を保存するための状態を初期化
    const [displayValue, setDisplayValue] = useState<number>(0);
    // VICS 更新
    useEffect(() => {
        const interval = setInterval(() => {
            // 0から9までの乱数を生成
            const randomValue = Math.floor(Math.random() * 10);
            // 乱数が0の場合（約10%の確率）、値を更新
            if (randomValue == 0) {
                // 新しい値を状態に設定
                console.log("update VICS")
                setDisplayValue(props.player?.timer.position);
            }
        }, 1000); // 1秒ごとにチェック

        // クリーンアップ関数
        return () => clearInterval(interval);
    }, [props.player]);

    return (
        <>
            <div className='compass'>
                <div className='compass-circle'>
                    <div className='compass-arrow'>
                        <div className='compass-north'>N</div>
                    </div>
                </div>
            </div>
            <div className='goal infobox'>
                <div className='goal infotitle'>GOAL</div>
                <div className='goal infotext'>
                    {((props.mikuMile[1] - props.mikuMile[0])/1000).toFixed(1)}&nbsp;
                    <span className="unit">kMM</span>
                </div>
            </div>
            {/* <div className='waypoint infobox'>
                <div className='waypoint infotitle'>WAYPOINT</div>
                <div className='waypoint infotext'>
                    x&nbsp;
                    <span className="unit">MM</span>
                </div>
            </div> */}
            <div className='vics infobox'>
                <span className='vics infotitle'>VICS</span>
                <div className='vics infotext'>
                    0{msToMs(displayValue)}
                </div>
            </div>
            <div className='scale infobox'>
                <div className='scale infotitle'>SCALE</div>
                <div className='scale infotext'>

                    {zoomToMikuMile}&nbsp;

                    <span className="unit">MM</span>
                </div>
                <div className='scale-line'></div>

            </div>
        </>
    )
}