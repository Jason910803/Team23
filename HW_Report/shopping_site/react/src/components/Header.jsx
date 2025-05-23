// components/Header.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../context/AuthContext"; // ⬅️ 引入 Context

function Header() {
  const { currentUser, handleLogout } = useContext(AuthContext);  // ⬅️ 從 Context 中取出值
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout?.();
    navigate("/welcome");
  };

  const isLoggedIn = !!currentUser;  // 有登入就是 true

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container">
        <Link className="navbar-brand" to="/welcome">
          購物網站
        </Link>

        {/* 折疊按鈕（小螢幕用） */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {isLoggedIn ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/smart-search"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    AI智慧推薦
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/smart-search">根據敘述推薦</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/weather">根據天氣推薦</Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">商品</Link> {/* 可以導向商品列表 */}
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">購物車</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">聯絡我們</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">會員資料</Link> {/* 可導向個人頁面 */}
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();       // 阻止跳轉
                      handleLogoutClick();      // 呼叫 logout 函數
                    }}
                  >
                    登出
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">登入</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">註冊</Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <a className="nav-link" href="http://localhost:8000/admin" target="_blank" rel="noreferrer">
                後台管理
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
