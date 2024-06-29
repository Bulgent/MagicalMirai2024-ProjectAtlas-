import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { GamePage } from './pages/GamePage';
import { WelcomePage } from './pages/WelcomePage'; // WelcomePage をインポート
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WelcomePage />} /> {/* WelcomePage へのルート */}
      <Route path="/navi" element={<GamePage />} /> {/* GamePage へのルート */}
      {/* 他のルートをここに追加 */}
    </Routes>
  </BrowserRouter>
);
