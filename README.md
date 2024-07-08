# Magical Mirai 2024 Programming Contest 応募作品
![Project Atras](https://github.com/Bulgent/ProjectAtlas/blob/dev/public/images/banner.png?raw=true)
- **チーム名** : Team AHEAD
- **プロジェクト名** : Project Atlas
- **作品名**: Magical Car Navigation
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
      <img alt="" src="https://img.shields.io/badge/-TextAlive-555.svg?logo=data:image/png;base64,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" />
      <img src="https://img.shields.io/badge/-Songle-555.svg?logo=&style=flat">
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
├── LICENSE # ライセンスに関するファイル。プロジェクトのライセンス情報を記載。
├── README.md # Readme。プロジェクトの概要やセットアップ方法などを記載。
├── fabicon.svg # ファビコン。ウェブサイトのタブに表示される小さなアイコン。
├── index.html # エントリーポイントのHTMLファイル。ウェブアプリケーションの基盤。
├── package-lock.json # npmでインストールされたパッケージの正確なバージョンを記録。
├── package.json # プロジェクトのメタデータと依存関係を管理。
├── public
│   └── images # ウェブサイトで使用される画像ファイルを格納。
│       ├── banner.png # プロジェクトのバナー画像。
│       ├── carIcon.png # 車のアイコン画像。
│       ├── jacket # アルバムや曲のジャケット画像を格納。
│       │   ├── future_notes.png
│       │   ├── itsuka_kimi_to_hanashita_mirai_wa.png
│       │   ├── mirai_koukyoukyoku.png
│       │   ├── reality.png
│       │   ├── superhero.png
│       │   ├── the_marks.png
│       │   └── the_marks_original.png
│       ├── logo.png # チームのロゴ画像。
│       ├── mm24_logo.png # マジカルミライのロゴ画像。
│       ├── mm24_welcome.png # ウェルカム画面用のマジカルミライロゴ画像。
│       └── project.png # プロジェクトのロゴ画像。
├── src
│   ├── App.tsx # アプリケーションのルートコンポーネント。
│   ├── assets
│   │   ├── jsons # JSON形式のデータファイルを格納。
│   │   │   └── map_data # 地図データ関連のJSONファイル。
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
│   │   └── marker # マーカー関連のファイルを格納。
│   │       └── markerSVG.ts # SVG 形式のマーカーと、 PNG 形式の車を定義。
│   ├── components # Reactコンポーネントを格納。
│   │   ├── HistoryComponent.tsx # マップページの履歴記録コンポーネント
│   │   ├── LyricComponent.tsx # マップページの歌詞表示コンポーネント
│   │   ├── MapComponent.tsx # マップページの地図表示コンポーネント
│   │   ├── MapInfoComponent.tsx # マップページの地図情報表示コンポーネント
│   │   ├── PlayerControlComponent.tsx # マップページの曲情報表示コンポーネント
│   │   ├── ResultDetailMapComponent.tsx # リザルトページの地図表示コンポーネント
│   │   └── RotatedMarker.tsx # 
│   ├── pages # ページコンポーネントを格納。各ルートに対応するビュー。
│   │   ├── GamePage.tsx # マップページ
│   │   ├── NotFoundPage.tsx # 404エラーページ。
│   │   ├── ResultPage.tsx # リザルトページ
│   │   └── WelcomePage.tsx # ウェルカムページ
│   ├── services # アプリケーションのロジックやAPI呼び出しを処理。
│   │   ├── ComputeAhead.ts # 
│   │   ├── ComputePath.ts #
│   │   ├── MapCenter.tsx # 
│   │   ├── RotateMarker.tsx # 
│   │   ├── TextAlive.ts # TextAlive の初期化処理。
│   │   └── UfoMarker.tsx # 地図上をランダムに動く UFO の処理。
│   ├── styles # CSSファイルを格納。スタイリングに使用。
│   │   ├── App.css # アプリ全体のスタイル。
│   │   ├── Game.css # マップページのスタイル。
│   │   ├── History.css # マップページの履歴のスタイル。
│   │   ├── Lyrics.css # マップページに表示される歌詞のスタイル。
│   │   ├── Map.css # マップページのマップのスタイル。
│   │   ├── MapInfo.css # マップページの地図情報のスタイル。
│   │   ├── NotFound.css # 404 ページのスタイル。
│   │   ├── Result.css # リザルトページのスタイル。
│   │   ├── SongControl.css # マップページの曲情報のスタイル。
│   │   ├── Welcome.css # ウェルカムページのスタイル。
│   │   └── leaflet.css # Leaflet ライブラリのスタイル。
│   ├── types # TypeScriptの型定義ファイルを格納。
│   │   ├── map_data.d.ts # マップデータの型。
│   │   └── types.d.ts # 変数や関数の型。
│   └── utils # ユーティリティ関数や共通のヘルパー関数を格納。
│       ├── MapLibraTileLayer.ts # 
│       ├── MapStyle.ts #
│       ├── Song.ts # 読み込む楽曲情報の関数
│       ├── credits.ts # アプリで使用したライブラリのクレジット
│       └── utils.ts # 地図や歌詞に関するヘルパー関数
├── tsconfig.json # TypeScriptのコンパイラオプションを設定。
├── tsconfig.node.json # Node.js環境用のTypeScript設定。
└── vite.config.ts # Viteの設定ファイル。ビルドや開発サーバの設定を記述。
</pre>