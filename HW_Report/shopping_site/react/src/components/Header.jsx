// components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        {/* Logo or Brand */}
        <Link className="navbar-brand" to="/">購物網站</Link>

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

        {/* 導覽列內容 */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* 導覽連結 */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">首頁</Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/products">商品</Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/about">關於我們</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">聯絡我們</Link>
            </li>
          </ul>

          {/* 搜尋欄 */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="搜尋商品"
              aria-label="Search"
            />
            <button className="btn btn-outline-light" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Header;
