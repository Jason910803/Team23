import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ⬅️ 匯入 context

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState("info");

  const navigate = useNavigate(); // ✅ 用來導頁
  const { setCurrentUser } = useContext(AuthContext); // ⬅️ 從 context 取出 setCurrentUser

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/accounts/login/",
        { username, password },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        },
      );

      // ✅ 登入成功後，更新 Context
      setCurrentUser({ name: username });
      navigate("/home");
    } catch (err) {
      console.log("Login error:", err);
      setMessage("❌ 登入失敗：" + (err.response?.data?.error || "伺服器錯誤"));
      setStatus("danger");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center">
              <h3>使用者登入</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert alert-${status}`}>{message}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">帳號</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">密碼</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    登入
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
