import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ 取得 CSRF token 工具
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",    // ✅ 對應後端 MyUser.name
    email: "",
    password: "", // ✅ 對應後端 MyUser.password
  });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/accounts/register/", form, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      setMsg("✅ 註冊成功！即將跳轉登入頁...");
      setTimeout(() => nav("/login"), 2000);
    } catch (err) {
      setMsg("❌ 註冊失敗：" + (err.response?.data?.error || "伺服器錯誤"));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">註冊新帳號</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={onSubmit}>
        {["name", "email", "password"].map((f) => (
          <div className="mb-3" key={f}>
            <label className="form-label">{f}</label>
            <input
              className="form-control"
              type={f.includes("password") ? "password" : "text"}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              required
            />
          </div>
        ))}
        <button className="btn btn-primary">註冊</button>
      </form>
    </div>
  );
}
