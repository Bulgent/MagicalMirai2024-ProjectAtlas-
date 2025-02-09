import { Player } from 'textalive-app-api';

type animationProperties = {
    id: number;
    value: number;
    display: boolean;
    change: string;
};

type noteProperties = {
    fwdLength: number; // 前方の距離
    crtLength: number; // 現在の距離
    crtPosStart: [lat: number, lng: number]; // 現在の座標始まり
    crtPosEnd: [lat: number, lng: number]; // 現在の座標終わり
};

type lyricProperties = {
    text: string;
    startTime: number;
    endTime: number;
    pos?: string;
}

type handOverPlayer = (player: Player) => void;
type handOverNumber = (number: number) => void;
type handOverLyric = (lyric: lyricProperties) => void;
type handOverString = (string: string) => void;
type handOverAny = (chorus: any) => void;
type handOverBoolean = (boolean: boolean) => void;

type createPlayerContent = {
    mediaElement: any
    songNumber: number
    handOverPlayer: handOverPlayer
    handOverSongInfo: handOverNumber
    handOverChar: handOverLyric
    handOverWord: handOverLyric
    handOverPhrase: handOverLyric
    handOverBeat: handOverAny
    handOverChord: handOverString
    handOverChorus: handOverAny
    handOverSongTitle: handOverString
    handOverSongArtist: handOverString
    handOverSongLength: handOverNumber
    handOverPlayTime: handOverNumber
    handOverApp: handOverAny
}

type historyProperties = {
    type: string
    properties: {
        index: number
        event_type: number
        event_place: string
        event_title: string
        event_detail: string
        want_score: number
        fanfun_score?: number
        cost: number
        weather: number
        season: number
        time: number
        playerPosition: number
    }
    geometry: {
        type: string
        coordinates: [number, number]
    }
}


type PointProperties = {
    name: string
    coordinates: [number, number]
}

type noteCoordinateProperties = {
    note: string
    lyric: string
    lat: number
    lng: number
    start: number
    end: number
}

type wordTimeProperties = {
    lyric: string;
    start: number;
    end: number
}

type noteTooltip = {
    fwdLength: number; // 前方の距離
    crtLength: number; // 現在の距離
    crtPosStart: [lat: number, lng: number]; // 現在の座標始まり
    crtPosEnd: [lat: number, lng: number]; // 現在の座標終わり
};