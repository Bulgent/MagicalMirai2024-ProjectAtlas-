import React from 'react';
import { Link } from 'react-router-dom'; // react-router-domを使用している場合
import '../styles/NotFound.css';

const NotFoundPage: React.FC = () => {
  return (
    <div id="display" className="soft-gloss">
      <div id="navi">
        <div className='bsod'>
          <div className='face'>
            {":("} 
            <img className='image-logo' src='src/assets/images/project.png' alt='' />
          </div>
          <div className='label'>
            404 Not Found
          </div>
          <div className='txt'>
            申し訳ありませんが お探しのページは見つかりませんでした
          </div>
          <div className='btn'>
            <Link to="/">曲選択画面に戻る</Link>
          </div>
        </div>
      </div>
      <img id='logo' src='src/assets/images/logo.png' alt='' />
    </div>
  );
};

export default NotFoundPage;