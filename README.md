# Magical Car Navigation

- **チーム名** : Team AHEAD
- **制作者** : Sarashina & Argynnini

# 開発環境

このプロジェクトは以下の環境で開発されました。

<table>
  <tr>
    <td>Env</td>
    <td>Lang</td>
  </tr>
  <tr>
    <td>
      <img src="https://img.shields.io/badge/-GitHub-555.svg?logo=github&style=flat">
      <img src="https://img.shields.io/badge/-Chrome-555.svg?logo=googlechrome&style=flat">
      <br>
      <img src="https://img.shields.io/badge/-npm-555.svg?logo=npm&style=flat">
      <img src="https://img.shields.io/badge/-nvm-555.svg?logo=nvm&style=flat">
      <br>
      <img src="https://img.shields.io/badge/-Leaflet-555.svg?logo=leaflet&style=flat">
      <img src="https://img.shields.io/badge/-OpenStreetMap-555.svg?logo=openstreetmap&style=flat">
      <br>
      <img src="https://img.shields.io/badge/-Songle-555.svg?logo=image/png;base64,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3/9lD9r/YQvU/2QO1v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/Yw3W/2IN2v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEeX/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZQ/a/2MN1v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLf/2IN0v9mEt//ZhLi/2YS4v9mEuL/ZhLi/2gd1f+AOeT/llLn/5ZS5/+WUuf/h0Dm/2sj1P9mEuL/ZhHl/2YS4v9mEuL/ZhLf/2IN0v9mEt//ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS3/9jDdb/ZhLf/2YS4v9mEuL/ZhLi/3Em2/+WWeT/nl7q/4ND3v9uMMf/bjHG/24wx/97O9b/mFnn/5pb6P96Ndz/ZhLi/2YS4v9mEuL/ZhLi/2IN0v9mEt//ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/Yg3S/2YS3/9mEuL/ZhLi/2YS4v+GRd7/llni/28h3v9mEt//cyXn/49P5f+SUuX/j0/l/3cr6P9mEeX/ah7b/4pK4P+WWeL/ZxXe/2YS4v9mEuL/ZhLi/2EL0v9mEt//ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2MN1v9lD9r/ZhLi/2YS4v9oFeH/jU7f/3453v9mEuL/g0Pe/86z6//69v3///v9///+/v//+/3/+/j9/9W/6/+NTuT/aBXh/3Up3/+WV+H/ahrf/2YS4v9mEuL/ZhHc/2EL1P9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/Yg3S/2YS4v9mEt//ZxDn/4I+4P+BO+D/ZxXe/5Re4v/y6Pr//v77///+/v///v7///7+///+/v///v7///7+//fv+v+mdub/ZxXe/3In3f+SUuX/ZhLi/2YS4v9mEuL/Yg3S/2YS3/9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2QO1v9lD93/ZhLi/2YR5f9tI9f/klLl/2cV3v+XYOP/+vX7///+/v/6+fr/1dXV/7W1tf+ysrL/srKy/8/Pzv/29vb///7+//7++/+qeub/ZhLi/4E74P99N9r/ZhLi/2YS4v9mEdz/Yw3W/2YS4v9mEuL/ZhLi/2YS4v9mEuL/Yg3S/2YS3/9mEuL/ZhHl/4lI4P90K9v/cSTh/+/i9v///v7/9fT0/7W1tf+fn5//n5+f/5+fn/+fn5//n5+f/6+vr//v7u7///7+//Tq+f+APd7/aRfh/5Za4P9mEeX/ZhLi/2YS4v9hC9L/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9hC9L/aBXh/2YS4v9nFd7/mlrt/2UY1/+ldOP///7+///+/v++vr7/n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//n5+f/7W1tf/6+fr//v77/7qU7P9mF9v/klLl/28h3v9mEuL/ZhLi/2EL0v9mEuL/ZhLi/2YS4v9mEuL/ZhLf/2EL1P9mEuL/ZhLi/2Udzv+eXur/ZhLi/8uv7////v7/8fHw/6Oio/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//oaCh/+bm5v///v7/28bx/2sc3f+KQOn/ezvP/2YS4v9mEuL/YQvU/2YR3P9mEuL/ZhLi/2YS4v9mEdz/YQvU/2YS4v9mEuL/YyDI/6Vp4v9mEeX/2sT3///+/v/l5eP/oaCh/5+fn/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//2dnZ///+/v/n2Pj/byHg/4pB5v9/Rcn/ZhLi/2YS4v9jDdb/ZQ/a/2YS4v9mEuL/ZhLi/2YR3P9hC9T/ZhLi/2YS4v9kHsv/oGHl/2YR5f/TvPT///7+/+vs6v+joqP/n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn//g4N////7+/+PS9f9sH+D/iD7m/31AzP9mEuL/ZhLi/2MN1v9lD9r/ZhLi/2YS4v9mEuL/ZhLf/2EL0v9mEuL/ZhLi/2UY1/+bWvD/ZxXe/7KJ4////v7///7+/6+vr/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//qqqq//b29v/+/vv/xqbt/2YX2/+OSer/dCvb/2YS4v9mEuL/Yg3S/2YS3/9mEuL/ZhLi/2YS4v9mEuL/YQvS/2gV4f9mEuL/ZhHl/5NR5P9tI9f/ezPk//jy+f///v7/6+zq/6enqP+fn5//n5+f/5+fn/+fn5//n5+f/6Oio//i4eH///7+//r1+/+PUeP/ZxXe/5Zd3v9mEuL/ZhLi/2YS4v9hC9L/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9kDtb/ZhLf/2YS4v9mEeX/cSvW/4tF6v9nFd7/sYbn//36+////v7/6eno/7m5uf+joqP/o6Kj/6Oio/+ysrL/4uHh///+/v/+/vv/xaDu/2cV3v94LOP/hkXe/2YR5f9mEuL/ZhLi/2EL0v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YR3P9jDdb/ZhLi/2YS3/9nEOf/jU7f/3Up3/9qGt//v5jv//36+////v7///7+//r5+v/29vb/+vn6///+/v///v7//v77/9K08v9qHtv/ahrf/5ld4v9mEuL/aBXh/2YS4v9kDtb/ZQ/d/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2IN0v9mEt//ZhLi/2YS3/9pF+H/mFnj/28h3v9rGuD/qXzl/+7f+v/9+vb///7+///+/v///v7///7+//jy/P+2jOn/byTd/2kX4f+WV+H/byHg/2YS4v9mEuL/ZhLf/2EL0v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLf/2IN0v9mEuL/ZhLi/2YS4v9qGt//llni/4A92/9mEuL/bynY/6Rx5f/38/r///7+//79+P/k0vX/ik7e/2YS4v9yKd3/mV3i/3Up3/9mEuL/ZhLi/2YS4v9jDdb/ZhHc/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZBDb/2MN1v9mEuL/ZhLi/2YS4v9oFt//h0Dk/5pj3/+ea+T/6tz3///+/v/+/vv/yK3m/3453v+ANeb/ll3e/49R4/9qGt//ZhLi/2YS4v9mEuL/Yw3W/2UP2v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZQ/a/2MN1v9mEuL/ZhLi/2YS4v9qGt//s4ro//r1+////v7/+vb9/8Kh7v+faN//k1ri/4RE1f9pF+T/ZhLi/2YS4v9mEuL/ZhLi/2UP2v9jDdb/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZQ/d/2MN1v9mEt//fjne/9i/9f/+/vv//v77//7++//WvvD/aRPm/2YR5f9mDuv/ZhHl/2cV3v9mEuL/ZhLi/2YS3/9jDdb/ZQ/a/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEeX/ZhLf/2UU0v/v4vb///v9//7++////v7///7+/8Cf6/9mEeX/ZxXe/2YS4v9mEuL/aBXh/3Ys4/94L9z/bR3U/2YR3P9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YR5f9nFd7/ahrf//jy+f//+/3//v77///+/v/+/vv/49L1/28h3v9mEdz/ZQ/d/2IN2v9/P9P/9Or5//369v+8lO3/ZxXe/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhHl/2YS4v9oFt//28bx///+/v/+/vv///7+///+/v///v7/x6vo/3Y2xf9vK8P/kFnV/+TS8////v7//fr2/5ti5/9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v+cZub//fr7///7/f///v7///7+///+/v///v7///b9///2/f//+/3//v77//7++//izff/byTd/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2oa3/+5kOz//fr7///+/v///v7///7+///+/v///v7//v77///+/v/+/vv/7t/6/4I+4P9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2cV3v+mdub/9+3+//7++//+/vv//v77//7++//+/fj///v9/9vC8/+GRd7/ZhHl/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v93M9v/pnbm/8Oe8v/IpfT/yKX0/7eO7f+NU97/ahrf/2YR5f9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEeX/ZhLf/2YS3/9nFd7/ZhLi/2YR5f9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v9mEuL/ZhLi/2YS4v8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==&style=flat">
      <img alt="" src="https://img.shields.io/badge/-TextAlive-555.svg?logo=data:image/png;base64,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" />
    </td>
    <td>
        <img src="https://img.shields.io/badge/-React-555.svg?logo=react&style=flat">
        <img src="https://img.shields.io/badge/-Node.js-555.svg?logo=nodedotjs&style=flat">
        <br>
        <img src="https://img.shields.io/badge/-TypeScript-555.svg?logo=typescript&style=flat">
        <img src="https://img.shields.io/badge/-JavaScript-555.svg?logo=javascript&style=flat">
        <br>
        <img src="https://img.shields.io/badge/-HTML5-333.svg?logo=html5&style=flat">
        <img src="https://img.shields.io/badge/-CSS3-555.svg?logo=css3&style=flat">
    </td>
  </tr>
</table>

## node バージョン

開発にはNode.jsのバージョン`v18.18.0`が使用されています。Node.jsがまだインストールされていない場合は、[Node.jsの公式サイト](https://nodejs.org/)からインストールしてください。

## ローカル開発環境のセットアップ

プロジェクトの依存関係をインストールし、ローカル開発サーバーを起動するには、以下のコマンドを実行します。

```bash
$ node -v
v18.18.0
$ npm install && npm run dev
```

## 想定動作環境

このプロジェクトは、Chromiumバージョン`126.0.6478.127` (64ビット) および画面サイズ`1920 x 1080 px`での動作を想定しています。

# 作品アピールポイント

「Magical Car Navigation」は、カーナビと音楽を掛け合わせたリリックアプリです。
今年度のマジカルミライのテーマである「ファンファントリップ」から、音楽と共に旅を楽しむ作品を実現したいという想いで制作しました。
曲が始まると、ユーザーを乗せた車は道中の音符を集めながら、目的地へと向かいます。
道中にある様々なイベントアイコンをクリックして立ち寄ることで、旅の充実感を高められます。
曲終了後は、立ち寄ったイベントを基に、旅を振り返ることができます。
曲に合わせた画面の演出、様々なイベントの種類、細かなカーナビ機能の再現がこの作品の魅力です。
是非、色んな場所に立ち寄って、音楽と共にあなたの旅を楽しんでみてください！

# 機能と操作方法

## タイトル画面

![title](https://github.com/Bulgent/ProjectAtlas/assets/88919409/69ce1e41-56e6-4b4d-96c0-afa880f21dee)

- **ホバー**：曲名ボタンにマウスカーソルを合わせると、その曲の情報が画面右側に表示されます。
- **クリック**：曲名ボタンをクリックすると、選択した曲と共に、あなたの旅がスタートします。

楽しい旅のスタートを切る準備が整ったら、はじめるボタンをクリックしてください！

## マップ画面

![map](https://github.com/Bulgent/ProjectAtlas/assets/88919409/54ca7f39-5644-412e-849f-505d0c13f8bc)

### 地図情報
- **方位磁針**:地図の方向を示します。
- **目標**: 現在位置から目的地までの距離を表示します。目的地までの経路の計算には[A*法](https://github.com/anvaka/ngraph.path)を使用しています。
- **VICS**: 渋滞や事故情報の最終更新時間を表示します。
- **SCALE**:地図の縮尺をします。
- **Trip Memories**:寄り道した地点のイベントの詳細を表示します。
- **FanFun 度**:旅の楽しさの度合いを表示します。寄り道を多くするほど、得点が上がります。

### 曲情報
- **曲名と歌手名**:旅といっしょに楽しむ曲の名前と作曲者情報を表示します。
- **シークバー**: 曲の現在の進捗と目的地までの進捗を示します。地図の時間に応じて色が変わります。また、訪れた地点のアイコンを表示します。
- **再生・一時停止ボタン**:曲の再生と一時停止を行います。
- **歌詞**:曲の歌詞を表示します。

### マップの操作
- **ドラッグ**: 地図を移動します。
- **マウスホイール**: 地図のズームレベルを調整します。

### アイコンと経路
- **アイコン**: 様々なイベントが用意されています。
- **ホバー**:アイコンにマウスを合わせると、施設名やイベント名が表示されます。
- **クリック**: アイコンをクリックして寄り道します。Hover Historiesにイベント詳細が記録されます。

## 結果画面

![result](https://github.com/Bulgent/ProjectAtlas/assets/88919409/90c586c5-7c4e-4661-b9c8-afa99f98fa95)


- **地図**: 訪れた地点の履歴を地図上に表示します。
- **FanFun度**:今回の旅のFanFun度を表示します。
- **Drive**:車の移動距離を示します。
- **Waypoint**:寄り道点の数を表示します。
- **旅の振り返り**:画面右側では、寄り道した思い出による旅の振り返りが行われます。
- **Go to Next trip...**: もう一度はじめから新たな旅を初めます。

---

# デモ動画
[Magical Car Navigation Demo Play](https://youtu.be/vfX5sz0QHfs)

# Web Site URL
[Magical Car Navigation](https://magical-car-navigation.netlify.app/)


# ディレクトリ構成

本プロジェクトのディレクトリ構成は以下のようになっています．
<pre>
.
├── LICENSE 
├── README.md
├── fabicon.svg
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── images
│       ├── banner.png
│       ├── carIcon.png
│       ├── jacket
│       │   ├── future_notes.png
│       │   ├── itsuka_kimi_to_hanashita_mirai_wa.png
│       │   ├── mirai_koukyoukyoku.png
│       │   ├── reality.png
│       │   ├── superhero.png
│       │   ├── the_marks.png
│       │   └── the_marks_original.png
│       ├── logo.png
│       ├── mm24_logo.png
│       ├── mm24_welcome.png
│       ├── project.png
│       └── right_arrow.svg
├── src
│   ├── App.tsx
│   ├── assets
│   │   ├── jsons
│   │   │   └── map_data
│   │   │       ├── area.json
│   │   │       ├── buildings.json
│   │   │       ├── event-all.json
│   │   │       ├── points-kai.json
│   │   │       ├── points.json
│   │   │       ├── polygons.json
│   │   │       ├── primary.json
│   │   │       ├── restrictedArea.json
│   │   │       ├── secondary.json
│   │   │       ├── sightseeing.json
│   │   │       └── trunk.json
│   │   └── marker
│   │       └── markerSVG.ts
│   ├── components
│   │   ├── HistoryComponent.tsx
│   │   ├── LyricComponent.tsx
│   │   ├── MapComponent.tsx
│   │   ├── MapInfoComponent.tsx
│   │   ├── PlayerControlComponent.tsx
│   │   ├── ResultDetailMapComponent.tsx
│   │   └── RotatedMarker.tsx
│   ├── pages
│   │   ├── GamePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ResultPage.tsx
│   │   └── WelcomePage.tsx
│   ├── services
│   │   ├── ComputeAhead.ts
│   │   ├── ComputePath.ts
│   │   ├── MapCenter.tsx
│   │   ├── RotateMarker.tsx
│   │   ├── TextAlive.ts
│   │   └── UfoMarker.tsx
│   ├── styles
│   │   ├── App.css
│   │   ├── Game.css
│   │   ├── History.css
│   │   ├── Lyrics.css
│   │   ├── Map.css
│   │   ├── MapInfo.css
│   │   ├── NotFound.css
│   │   ├── Result.css
│   │   ├── SongControl.css
│   │   ├── Welcome.css
│   │   └── leaflet.css
│   ├── types
│   │   ├── map_data.d.ts
│   │   └── types.d.ts
│   └── utils
│       ├── MapLibraTileLayer.ts
│       ├── MapStyle.ts
│       ├── Song.ts
│       ├── credits.ts
│       └── utils.ts
├── tash apply stash@{0}
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
</pre>