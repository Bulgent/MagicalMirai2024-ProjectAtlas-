import './App.css';
import MapComponent from './MapComponent.tsx';
import TopComponent from './TopComponent.tsx';
import LyricComponent from './LyricComponent';
import SelectSongConponent from './SelectSong'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={TopComponent} />
        <Route path='/lyric' Component={LyricComponent} />
        {/* <Route path='/lyric' Component={SelectSongConponent} /> */}
        <Route path='/map' Component={MapComponent} />
      </Routes>
      <p>
      <Link to='/'>Back To Top</Link>
      </p>
      <p>
      <Link to='/lyric'>Lyric</Link>
      </p>
      <p>
      <Link to='/map'>Map</Link>
      </p>
      
    </BrowserRouter>
  );
}

export default App;
