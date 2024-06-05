import './App.css';
import { useCallback, useState, useEffect } from 'react';

export const HistoryComponent = (props: any) => {
    return (
        <>
            <div>歌詞：{props.kashiPhrase.text}</div>
            <div>単語：{props.kashiWord.text}</div>
            <div>文字：{props.kashiChar.text}</div>
        </>
    )
}
