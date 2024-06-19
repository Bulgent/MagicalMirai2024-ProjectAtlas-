import { calculateDistance, calculateVector } from '../utils/utils.ts'

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
}


/**
 * 道の通過点座標(node)より車の頭の向きを決める
 */
export const ComputeAhead =  (nodes: Node[]): [Ahead[], number[]] => {
    const lstLength:number = nodes.length
    const unit_vectors: Ahead[] = []
    for (let i=0; i<lstLength-1; i++){
        const[latVector, lonVector, distance] = calculateVector(nodes[i], nodes[i + 1])
        const unit_vector: Vector = [lonVector/distance, latVector/distance];
        const distance_km = calculateDistance(nodes[i], nodes[i+1]);
        unit_vectors.push({ unit_vector, distance_km });
    }
    const aheads = smoothBetweenVectors(unit_vectors, 0.005, 10)
    const cumulativeRatioLst = calculateCumulativeRatio(aheads)
    return [aheads, cumulativeRatioLst]
}

/**
 * comprehendBetweenVectorsを全体に適用する
 */
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
                {
                    unit_vector: smooth_unit_vector,
                    distance_km: smooth_distance/(smooth_plot_count)
                }
            )
        }
        aheads.push(endAhead)
    }
    return aheads
}


/**
 * ベクトル間をスムーズにする
 * plot_count(2以上)を大きくすると滑らかになる
 */
const comprehendBetweenVectors = (unit_vector_start: Vector, unit_vector_end: Vector, plot_count: number): Vector[] => {
    if (plot_count < 2) {
        throw new Error('plot_count must be greater than or equal to 2');
    }

    let vectors: Vector[] = [];

    // 2つのベクトルの間の角度を計算
    const [start_x, start_y] = unit_vector_start;
    const [end_x, end_y] = unit_vector_end;
    const angle_start = Math.atan2(start_y, start_x);
    const angle_end = Math.atan2(end_y, end_x);
    const angle_diff = angle_end - angle_start;

    // その角度をplots_countで分割し、間のベクトルを補完する
    const angle_step = angle_diff / (plot_count - 1);
    let current_angle = angle_start;
    for (let i = 0; i < plot_count; i++) {
        const vector: Vector = [Math.cos(current_angle), Math.sin(current_angle)];
        vectors.push(vector);
        current_angle += angle_step;
    }

    return vectors;
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