import { Player } from 'textalive-app-api';

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
type handOverBoolean = (boolean:boolean) => void;

type createPlayerContent = {
    mediaElement:any
    songNumber:number
    handOverPlayer: handOverPlayer
    handOverSongInfo: handOverNumber
    handOverChar: handOverLyric
    handOverWord: handOverLyric
    handOverPhrase: handOverLyric
    handOverBeat: handOverString
    handOverChord: handOverString
    handOverChorus: handOverAny
    handOverSongTitle:handOverString
    handOverSongArtist:handOverString
    handOverSongLength:handOverNumber
    handOverPlayTime:handOverNumber
    handOverApp: handOverAny
}

type historyProperties = {
    type: string
    properties: {
        type: number
        name: string
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