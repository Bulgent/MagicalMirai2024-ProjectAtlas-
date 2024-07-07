import { divIcon } from 'leaflet';

// 🚗
export const pngCar = '<img src="/images/carIcon.png" alt="🛸">';

// 🎸
export const pngMM24 = '<img src="/images/mm24_logo.png" alt="🎸" style="width: 250px; height: 92.5px; object-fit: contain;">';

// 🔦
export const lightCar = '\
<div class="car-lamp">\
    <div class="car-head-lamp-left"></div>\
    <div class="car-head-lamp-right"></div>\
    <div class="car-tail-lamp-left"></div>\
    <div class="car-tail-lamp-right"></div>\
</div>';

// ✜
export const mapCross = '<span class="emoji startflag" style="font-family: \'Noto Emoji\'; font-size: 50px; color: black; text-align: center; text-shadow: 0px 0px 0 #fff, 0px 0px 0 #fff, 0px 0px 0 #fff, 1px 1px 0 #fff;">✛</span>';
// 🚩
export const emojiStart = '<span class="emoji startflag" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🚩</span>';

// 🏁
export const emojiGoal = '<span class="emoji goalflag" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🏁</span>';

// 👽
export const emojiAlien = '<span class="emoji alien" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">👽</span>';

// 🦄
export const emojiUnicorn = '<span class="emoji unicorn" style="font-family: \'Noto Color Emoji\'; font-size: 100px; text-align: center;">🦄</span>';

// 🛸
export const emojiUfo = '<span class="emoji ufo" style="font-family: \'Noto Color Emoji\'; font-size: 100px; text-align: center;">🛸</span>';

// 🎵
export const emojiNote = '<span class="emoji note" style="font-family: \'Noto Emoji\'; font-size: 45px; text-align: center;">🎵</span>';

// ♨️
export const emojiHotSpring = '<span class="emoji hotspring" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">♨</span>';

// 🏟️
export const emojiSports = '<span class="emoji sports" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🏟️</span>'

// 🍽
export const emojiEat = '<span class="emoji eat" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🍽</span>';

// 📽️
export const emojiMovie = '<span class="emoji movie" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">📽️</span>';

// 🐬
export const emojiAqua = '<span class="emoji aqua" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🐬</span>';

// 🦁
export const emojiZoo = '<span class="emoji zoo" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🦁</span>';

// 🏬
export const emojiDepart = '<span class="emoji depart" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🏬</span>';

// 🏯
export const emojiCastle = '<span class="emoji castle" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🏯</span>';

// 🎡
export const emojiAmusement = '<span class="emoji amusement" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🎡</span>';

// 🎆
export const emojiFestival = '<span class="emoji festival" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🎆</span>';

// 🏭
export const emojiFactory = '<span class="emoji factory" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🏭</span>';

// 🏛
export const emojiBuil = '<span class="emoji buil" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">🏛</span>';

// ⛩️
export const emojiShrine = '<span class="emoji shrine" style="font-family: \'Noto Color Emoji\'; font-size: 45px; text-align: center;">⛩️</span>';

export const emojiSight = [
    emojiSports, // スポーツ
    emojiEat, // 食事
    emojiMovie, // 映画館
    emojiAqua, // 水族館
    emojiZoo, // 動物園
    emojiDepart, // 買い物
    emojiCastle, // 史跡名勝
    emojiHotSpring, // 温泉
    emojiAmusement, // 遊園地
    emojiFestival, // 祭り
    emojiFactory, // 工場見学
    emojiBuil // その他
]

export const mmIcon = divIcon({
    html: pngMM24,
    iconSize: [250, 92.5],
    iconAnchor: [250 / 2, 92.5 / 2],
    className: "icon-goal"
});

export const carIcon = divIcon({ // 31x65px
    className: 'car-icon', // カスタムクラス名
    html: pngCar,  // ここに車のアイコンを挿入する
    iconSize: [31, 65], // アイコンのサイズ
    iconAnchor: [31 / 2, 65 / 2] // アイコンのアンカーポイント（原点をアイコンの中心に設定）
});

export const carLightIcon = divIcon({ // 31x65px
    className: 'car-icon', // カスタムクラス名
    html: lightCar,  // ここに車のアイコンを挿入する
    iconSize: [31, 65], // アイコンのサイズ
    iconAnchor: [31 / 2, 65 / 2] // アイコンのアンカーポイント（原点をアイコンの中心に設定）
});

// UFOアイコンの設定
export const ufoIcon = divIcon({
    className: 'ufo-icon', // カスタムクラス名
    html: emojiUfo, // UFOアイコンのHTML
    iconSize: [100, 100], // アイコンのサイズ
    iconAnchor: [50, 50] // アイコンのアンカーポイント
});

// ユニコーンアイコンの設定
export const unicornIcon = divIcon({
    className: 'unicorn-icon', // カスタムクラス名
    html: emojiUnicorn, // UFOアイコンのHTML
    iconSize: [100, 100], // アイコンのサイズ
    iconAnchor: [50, 50] // アイコンのアンカーポイント
});

