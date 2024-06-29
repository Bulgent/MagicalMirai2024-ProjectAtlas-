import '../styles/MapInfo.css';

export const MapInfoComponent = (props: any) => {
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
                    {(props.mikuMile[1] - props.mikuMile[0]).toFixed(0)}&nbsp;
                    <span className="unit">MM</span>
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
                <div className='vics infotext'>12:34</div>
            </div>
            <div className='scale infobox'>
                <div className='scale infotitle'>SCALE</div>
                <div className='scale infotext'>
                    YY&nbsp;
                    <span className="unit">MM</span>
                </div>
                <div className='scale-line'></div>

            </div>
        </>
    )
}