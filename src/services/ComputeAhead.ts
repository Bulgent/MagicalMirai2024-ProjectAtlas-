import { calculateVector, calculateAngleBetweenVectors } from '../utils/utils.ts'

type Node = [
    lat: number,
    lon: number
]

type Vector = [
    lon: number,
    lat: number
]

type Ahead = {
    unit_vector: Vector // 地図における頭の向き
    distance_km: number // その向きでいる距離
    degree?: number // 角度（度数法）
}


const calculateAngle = (x: number, y: number): number => {
    // Math.atan2(y, x) は、ベクトル (x, y) のラジアンでの角度を返します
    let radians: number = Math.atan2(-y, x);
    
    // ラジアンを度数法に変換します
    let degrees: number = radians * (180 / Math.PI);
    
    // 負の角度を正確に変換して、0度〜360度の範囲にします
    if (degrees < 0) {
        degrees += 360;
    }
    return degrees;
};

/**
 * 道の通過点座標(node)より車の頭の向きを決める
 */
export const ComputeAhead =  (nodes: Node[]): [Ahead[], number[], number[]] => {
    const lstLength:number = nodes.length
    const unit_vectors: Ahead[] = []
    for (let i=0; i<lstLength-1; i++){
        const[latVector, lonVector, distance] = calculateVector(nodes[i], nodes[i + 1])
        const unit_vector: Vector = [lonVector/distance, latVector/distance];
        unit_vectors.push({ unit_vector, distance_km:distance });
    }
    // const aheads = smoothBetweenVectorsKai(unit_vectors, 0.001, 30)
    const aheads = unit_vectors
    const cumulativeRatioLst = calculateCumulativeRatio(aheads)
    const degreeAngles = aheads.map((x) => {
        return calculateAngle(x.unit_vector[1], x.unit_vector[0]);
        // return x.degree!
      });
    return [aheads, degreeAngles, cumulativeRatioLst]
}

/**
 * comprehendBetweenVectorsを全体に適用する
 * smooth_distance_km: 補完する距離（km）
 * smooth_plot_count: 補完する点の数
 */
/* @ts-ignore */
const smoothBetweenVectors = (unit_vectors:Ahead[], smooth_distance_km:number, smooth_plot_count:number):Ahead[] => {
    const vrctorCount = unit_vectors.length
    const aheads:Ahead[] = []
    for (let i=0; i<vrctorCount-1; i++){
        const smooth_unit_vectors = comprehendBetweenVectors(unit_vectors[i].unit_vector, unit_vectors[i+1].unit_vector, smooth_plot_count)
        let smooth_distance = smooth_distance_km
        if (unit_vectors[i].distance_km < smooth_distance_km/2 || unit_vectors[i+1].distance_km < smooth_distance_km/2){
            smooth_distance = Math.min(unit_vectors[i].distance_km, unit_vectors[i+1].distance_km)
        }

        const startAhead:Ahead = {
            unit_vector: unit_vectors[i].unit_vector,
            distance_km: unit_vectors[i].distance_km - smooth_distance/2
        }
        const endAhead:Ahead = {
            unit_vector: unit_vectors[i+1].unit_vector,
            distance_km: unit_vectors[i+1].distance_km - smooth_distance/2
        }
        aheads.push(startAhead)
        for (let smooth_unit_vector of smooth_unit_vectors){
            aheads.push(
                {   /* @ts-ignore */
                    unit_vector: smooth_unit_vector,
                    distance_km: smooth_distance/(smooth_plot_count+1)
                }
            )
        }
        aheads.push(endAhead)
    }
    return aheads
}

/* @ts-ignore */
const smoothBetweenVectorsKai = (unit_vectors:Ahead[], smooth_distance_km:number, smooth_plot_count:number):Ahead[] => {
    const vrctorCount = unit_vectors.length
    const aheads:Ahead[] = []
    for (let i=0; i<=vrctorCount-1; i++){
        
        if(i === 0){
            let smooth_distance = smooth_distance_km
            if (unit_vectors[i].distance_km < smooth_distance_km/2 || unit_vectors[i+1].distance_km < smooth_distance_km/2){
                smooth_distance = Math.min(unit_vectors[i].distance_km, unit_vectors[i+1].distance_km)*2
            }
            const [smooth_unit_vectors, degrees] = comprehendBetweenVectors(unit_vectors[i].unit_vector, unit_vectors[i+1].unit_vector, smooth_plot_count)
            const startAhead:Ahead = {
                unit_vector: unit_vectors[i].unit_vector,
                distance_km: unit_vectors[i].distance_km - smooth_distance/2,
                degree: calculateAngle(unit_vectors[i].unit_vector[1], unit_vectors[i].unit_vector[0])
            }
            aheads.push(startAhead)
            for (let j=0;j<smooth_unit_vectors.length;j++){
                aheads.push(
                    {
                        unit_vector: smooth_unit_vectors[j],
                        distance_km: smooth_distance/(smooth_plot_count),
                        degree:degrees[j],
                    }
                )
            }
        }else if(i===vrctorCount-1){
            let smooth_distance = smooth_distance_km
            if (unit_vectors[i-1].distance_km < smooth_distance_km/2 || unit_vectors[i].distance_km < smooth_distance_km/2){
                smooth_distance = Math.min(unit_vectors[i-1].distance_km, unit_vectors[i].distance_km)*2
            }
            const startAhead:Ahead = {
                unit_vector: unit_vectors[i].unit_vector,
                distance_km: unit_vectors[i].distance_km - smooth_distance/2,
                degree: calculateAngle(unit_vectors[i].unit_vector[1], unit_vectors[i].unit_vector[0])
            }
            aheads.push(startAhead)
        }else{
            let smooth_distance_before;
            let smooth_distance_after;
            if (unit_vectors[i-1].distance_km < smooth_distance_km/2 || unit_vectors[i].distance_km < smooth_distance_km/2){
                smooth_distance_before = Math.min(unit_vectors[i-1].distance_km, unit_vectors[i].distance_km)*2
            }else{
                smooth_distance_before = smooth_distance_km
            }
            if (unit_vectors[i].distance_km < smooth_distance_km/2 || unit_vectors[i+1].distance_km < smooth_distance_km/2){
                smooth_distance_after = Math.min(unit_vectors[i].distance_km, unit_vectors[i+1].distance_km)*2
            }else{
                smooth_distance_after = smooth_distance_km
            }
            const startAhead:Ahead = {
                unit_vector: unit_vectors[i].unit_vector,
                distance_km: unit_vectors[i].distance_km - (smooth_distance_before+smooth_distance_after)/2,
                degree: calculateAngle(unit_vectors[i].unit_vector[1], unit_vectors[i].unit_vector[0])
            }
            aheads.push(startAhead)
            const [smooth_unit_vectors, degrees] = comprehendBetweenVectors(unit_vectors[i].unit_vector, unit_vectors[i+1].unit_vector, smooth_plot_count)
            for (let j=0;j<smooth_unit_vectors.length;j++){
                aheads.push(
                    {
                        unit_vector: smooth_unit_vectors[j],
                        distance_km: smooth_distance_after/(smooth_plot_count-1),
                        degree:degrees[j],
                    }
                )
            }
        }
        // if (unit_vectors[i].distance_km < smooth_distance_km/2 || unit_vectors[i+1].distance_km < smooth_distance_km/2){
        //     smooth_distance = Math.min(unit_vectors[i].distance_km, unit_vectors[i+1].distance_km)
        // }

        // const startAhead:Ahead = {
        //     unit_vector: unit_vectors[i].unit_vector,
        //     distance_km: unit_vectors[i].distance_km - smooth_distance/2
        // }
        // const endAhead:Ahead = {
        //     unit_vector: unit_vectors[i+1].unit_vector,
        //     distance_km: unit_vectors[i+1].distance_km - smooth_distance/2
        // }
        // aheads.push(startAhead)
        // for (let smooth_unit_vector of smooth_unit_vectors){
        //     aheads.push(
        //         {
        //             unit_vector: smooth_unit_vector,
        //             distance_km: smooth_distance/(smooth_plot_count+1)
        //         }
        //     )
        // }
        // aheads.push(endAhead)
    }
    return aheads
}

/**
 * ベクトル間をスムーズにした度数角度を返す
 * 角度は北向きを0度とし、反時計回りの角度系
 * plot_count(2以上)を大きくすると滑らかになる
 */
const comprehendBetweenVectors = (unit_vector_start: Vector, unit_vector_end: Vector, plot_count: number): [Vector[], number[]] => {
    if (plot_count < 2) {
        throw new Error('plot_count must be greater than or equal to 2');
    }
    let isClockwise:Boolean;
    let vectors: Vector[] = [];

    // 2つのベクトルの間の角度を計算
    const [start_x, start_y] = unit_vector_start;
    const [end_x, end_y] = unit_vector_end;
    let angle_diff:number;
    // 車の回転方向で場合分け（単位ベクトルを仮定）
    if (end_x - start_x > 0){ 
        if (end_y - start_y>0){
            angle_diff = calculateAngleBetweenVectors(unit_vector_start, unit_vector_end) // 左折（反時計回り）
            isClockwise = false
        }else{
            angle_diff = -1*calculateAngleBetweenVectors(unit_vector_start, unit_vector_end) // 右折（時計回り）
            isClockwise = true
        }
    }else{
        if (end_y - start_y>0){
            angle_diff = -1*calculateAngleBetweenVectors(unit_vector_start, unit_vector_end) // 右折（時計回り）
            isClockwise = true
        }else{
            angle_diff = calculateAngleBetweenVectors(unit_vector_start, unit_vector_end) // 左折（反時計回り）
            isClockwise = false
        }
    }
    // console.log(angle_diff * 180 / Math.PI)
    // if (angle_diff * 180 / Math.PI<-180 || angle_diff * 180 / Math.PI>180){
    //     console.warn(angle_diff)
    // }
    const angle_start_degree = calculateAngle(start_y, start_x);
    const angle_end_degree = calculateAngle(end_y, end_x);

    let diff_degree;
    if(isClockwise){
        diff_degree = (angle_start_degree - angle_end_degree) / (plot_count - 1);
    }else{
        diff_degree = (angle_end_degree - angle_start_degree) / (plot_count - 1);
    }
    // diff_degree = (angle_end_degree - angle_start_degree) / (plot_count - 1);
    // その角度をplots_countで分割し、間のベクトルを補完する
    const angle_start = Math.atan2(start_y, start_x);
    const angle_step = angle_diff / (plot_count - 1);
    let current_angle = angle_start;
    let current_angle_degree = angle_start_degree;
    let degrees:number[] = []
    for (let i = 0; i < plot_count-1; i++) {
        current_angle += angle_step
        current_angle_degree += diff_degree
        const vector: Vector = [Math.cos(current_angle), Math.sin(current_angle)];
        vectors.push(vector);
        degrees.push(current_angle_degree)
        // if (angle_diff * 180 / Math.PI===99.16836013643096){
        //     console.log(unit_vector_start, angle_start * 180 / Math.PI)
        //     console.log("now", vector, current_angle * 180 / Math.PI)
        //     console.log(calculateAngle(vector[0], vector[1]))
        // }
        
    }
    return [vectors, degrees];
}


// eachAheadLengthRatio
const calculateCumulativeRatio = (aheads: Ahead[]): number[] => {
    let sum_distance:number = 0
    let cumulativeRatioLst:number[] = []

    for (let ahead of aheads){
        sum_distance += ahead.distance_km
        cumulativeRatioLst.push(sum_distance)
    }

    cumulativeRatioLst = cumulativeRatioLst.map(x => x/sum_distance)
    return cumulativeRatioLst
}