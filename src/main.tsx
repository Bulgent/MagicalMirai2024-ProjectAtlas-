import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './App.css';
import {foo} from './services/ComputePath.ts'

// foo()
ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
);
