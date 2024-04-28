import './App.css';
import MapComponent from './MapComponent.tsx';
import TopComponent from './TopComponent.tsx';
import LyricComponent from './LyricComponent';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={TopComponent} />
        <Route path='/lyric' Component={LyricComponent} />
        <Route path='/map' Component={MapComponent} />
      </Routes>
      <Link to='/'>Back To Top</Link>
    </BrowserRouter>
  );
}

export default App;
