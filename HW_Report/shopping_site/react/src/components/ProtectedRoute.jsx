import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    axiosInstance
      .get("/api/accounts/whoami/")
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);
  if (auth === null) return <div>載入中...</div>;
  return auth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
