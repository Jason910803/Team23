// src/pages/AboutPage.jsx
import React from 'react';

export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">關於我們</h2>
              <p className="text-muted text-center mb-3">
                我們是一個致力於提供高品質商品與服務的電商網站。
              </p>
              <p>
                無論您是追求科技、時尚、生活用品，我們的團隊都嚴選最優質的產品，並致力於提供迅速、安全的購物體驗。
              </p>
              <p>
                有任何建議或合作機會，歡迎透過聯絡我們頁面與我們聯繫。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
