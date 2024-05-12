import './App.css';
import LyricComponent from './LyricComponent';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={LyricComponent} />
      </Routes>      
    </BrowserRouter>
  );
}

export default App;
