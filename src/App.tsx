import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WelcomePage } from './pages/WelcomePage'; // WelcomePage をインポート
import { GamePage } from './pages/GamePage';
import { ResultPage } from './pages/ResultPage'; // ResultPage をインポート
import NotFoundPage from './pages/NotFoundPage'; // NotFoundPage をインポート
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WelcomePage />} /> {/* WelcomePage へのルート */}
      <Route path="/navi" element={<GamePage />} /> {/* GamePage へのルート */}
      <Route path="/result" element={<ResultPage />} /> {/* ResultPage へのルート */}
      {/* 他のルートをここに追加 */}
      <Route path="*" element={<NotFoundPage />} /> {/* 404ページへのルート */}
    </Routes>
  </BrowserRouter>
);
