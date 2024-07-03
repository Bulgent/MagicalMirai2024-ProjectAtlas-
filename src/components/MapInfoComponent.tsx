import '../styles/MapInfo.css';
import { useState, useEffect } from 'react';
import { calculateScale, msToMs } from '../utils/utils.ts'


export const MapInfoComponent = (props: any) => {
    const [vics, setVics] = useState<number>(0);
    const [scale, setScale] = useState<number>(0);

    // VICS 更新
    useEffect(() => {
        const interval = setInterval(() => {
            // 0から9までの乱数を生成
            const randomValue = Math.floor(Math.random() * 10);
            // 乱数が0の場合（約10%の確率）、値を更新
            if (randomValue == 0 && props.player?.timer.position != 0) {
                // 新しい値を状態に設定
                console.log("update VICS")
                setVics(props.player?.timer.position);
            } else if (props.player?.timer.position == 0) {
                setVics(0);
            }
        }, 1000); // 1秒ごとにチェック

        // クリーンアップ関数
        return () => clearInterval(interval);
    }, [props.player]);

    // ズーム値更新
    useEffect(() => {
        const calculatedValue = calculateScale(props.scale);
        setScale(calculatedValue);
    }, [props.scale]);

    return (
        <>
            <div className='compass'>
                <div className='compass-circle' data-tooltip="北の方向">
                    <div className='compass-arrow'>
                        <div className='compass-north'>N</div>
                    </div>
                </div>
            </div>
            <div className='goal infobox' data-tooltip="目的地までの距離">
                <div className='goal infotitle'>GOAL</div>
                <div className='goal infotext'>
                    {((props.mikuMile[1] - props.mikuMile[0]) / 1000).toFixed(1)}&nbsp;
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
            <div className='vics infobox' data-tooltip="地図情報の更新時間">
                <span className='vics infotitle'>VICS</span>
                <div className='vics infotext'>
                    0{msToMs(vics)}
                </div>
            </div>
            <div className='scale infobox' data-tooltip="地図の縮尺">
                <div className='scale infotitle'>SCALE</div>
                <div className='scale infotext'>
                    {scale.toFixed(0)}&nbsp;
                    <span className="unit">MM</span>
                </div>
                <div className='scale-line'></div>

            </div>
        </>
    )
}