import React from "react";
import "./WelcomePage.css"; // 加入 CSS 模組化樣式

function WelcomePage() {
  return (
    <div className="welcome-page">
      <div className="overlay d-flex flex-column justify-content-center align-items-center text-center p-4">
        <div className="card glass-card p-4 shadow-lg animate__animated animate__fadeInDown">
          <h1 className="display-5 fw-bold text-white mb-3">
            🛒 歡迎光臨 GoGo 購物！
          </h1>
          <p className="lead text-white-50">
            購物的世界，從這裡開始。立即探索最熱門商品與優惠活動。
          </p>
          <p className="text-light mt-2">
            🔐 請先 <strong>於右上角登入帳號</strong> 以開始您的購物旅程。
          </p>

          {/* <div className="d-flex gap-3 mt-4 justify-content-center">
            <Link to="/login" className="btn btn-warning btn-lg shadow">
              立即登入
            </Link>
            <Link to="/shop" className="btn btn-primary btn-lg shadow">
              開始逛街
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg">
              關於我們
            </Link>
          </div> */}
        </div>

      </div>
    </div>
  );
}

export default WelcomePage;
