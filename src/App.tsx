import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import MapComponent from './MapComponent.tsx';
import LyricComponent from './LyricComponent';

function App() {
  return (
    <>
      <LyricComponent />
      <MapComponent />
    </>
  );
}

export default App;
