import React from 'react';
import { Link } from 'react-router-dom'; // react-router-domを使用している場合

const NotFoundPage: React.FC = () => {
  return (
    <div id="display" className="soft-gloss">
      <div id="navi" className="split">
        <div className='apologize'>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 Not Found</h1>
            <p>申し訳ありませんが お探しのページは見つかりませんでした</p>
            <p>
              <Link to="/">曲選択画面に戻る</Link>
            </p>
            <h3>ニコニコ動画が一日でも早く復旧しますように．．． (*´人`*)</h3>
          </div>
        </div>
      </div>
      <img id='logo' src='src/assets/images/logo.png' alt='' />
    </div>
  );
};

export default NotFoundPage;