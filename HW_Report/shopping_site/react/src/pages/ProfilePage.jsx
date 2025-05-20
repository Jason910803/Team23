import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

function getCookie(name) {
  const v = `; ${document.cookie}`;
  const p = v.split(`; ${name}=`);
  if (p.length === 2) return p.pop().split(";").shift();
}

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  // 讀取會員資料
  useEffect(() => {
    axiosInstance
      .get("/api/accounts/profile/", { withCredentials: true })
      .then((res) => setForm({ ...form, ...res.data, password: "" }))
      .catch((err) => setMsg("讀取失敗：" + err));
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch("/api/accounts/profile/", form, {
        withCredentials: true,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });
      setMsg("✅ 更新成功！");
      // 若改了 name，要更新全域登入狀態
      setCurrentUser({ name: res.data.name });
    } catch (err) {
      setMsg("❌ 更新失敗：" + JSON.stringify(err.response?.data));
    }
  };

  if (!currentUser) return <p className="mt-5 text-center">請先登入</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">會員資料</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={onSubmit} style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label">帳號名稱</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">新密碼（留空表示不修改）</label>
          <input
            className="form-control"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn btn-primary">儲存變更</button>
      </form>
    </div>
  );
}
