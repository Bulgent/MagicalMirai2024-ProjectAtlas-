import './App.css';
import { useCallback, useState, useEffect } from 'react';

export const HistoryComponent = (props: any) => {
    return (
        <>
            <div>フレーズ：<br/>{props.kashiPhrase}</div>
            <div>単語：{props.kashiWord}</div>
            <div>文字：{props.kashiChar}</div>
        </>
    )
}
