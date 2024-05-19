import './App.css';
import { useCallback, useState, useEffect } from 'react';

export const HistoryComponent = (props: any) => {
    return (
        <>
        <div>{props.kashiPhrase}</div>
        <div>{props.kashiWord}</div>
        <div>{props.kashiChar}</div>
        </>
    )
}
