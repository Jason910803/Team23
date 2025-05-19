import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage"
import WelcomePage from "./pages/WelcomePage"
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { ToastContainer, toast, Bounce } from "react-toastify";

import { AuthContext } from "./context/AuthContext";

function App() {
  const [cart, setCart] = useState(
    localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [],
  );

  const [currentUser, setCurrentUser] = useState(null); // ✅ 加入登入狀態

  // ⏳ 啟動時檢查是否已登入
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/accounts/whoami/", { withCredentials: true })
      .then((res) => {
        if (res.data.username) {
          setCurrentUser({ name: res.data.username });
        }
      })
      .catch((err) => {
        console.log("未登入", err);
      });
  }, []);

  // 🔓 登出函數
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:8000/api/accounts/logout/",
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": getCookie("csrftoken")  // ✅ 加這行
          }
        }
      )
      .then(() => {
        setCurrentUser(null);
      })
      .catch((err) => {
        console.error("🚨 登出失敗", err);
      });
  };
  
  localStorage.setItem("cart", JSON.stringify(cart));

  const notify = (messege, type = "info") => {
    toast[type](messege, {
      position: "bottom-right",
      autoClose: 3000,
      draggable: false,
      hideProgressBar: true,
      closeOnClick: true,
      transition: Bounce,
    });
  };

  const checkToggle = (product, value) => {
    setCart((c) => {
      let idx = c.findIndex((p) => p.id === product.id);
      return c.with(idx, { ...product, checked: value ?? !c.at(idx).checked });
    });
  };

  const addCart = (product) => {
    setCart((c) => {
      let idx = c.findIndex((p) => p.id === product.id);
      if (idx === -1)
        return c.concat({ ...product, amount: 1, checked: false });

      let newAmount = c.at(idx).amount + 1;
      if (newAmount > product.stock) newAmount = product.stock;
      return c.with(idx, { ...product, amount: newAmount });
    });
  };

  const removeCart = (product) => {
    setCart((c) => {
      let idx = c.findIndex((p) => p.id === product.id);
      return c.with(idx, { ...product, amount: c.at(idx).amount - 1 });
    });
  };

  const removeRow = (product) => {
    setCart((c) => c.filter((p) => p.id !== product.id));
  };

  const handleAddToCart = (product, selectedQuantity = 1) => {
    let amount = cart.find((p) => p.id === product.id)?.amount;
    if (amount && selectedQuantity + amount > product.stock) {
      for (let i = 0; i < product.stock - amount; i++) addCart(product);
      notify(
        `您選的數量超過庫存，為您加入 ${product.stock - amount} 件 ${product.name} 到購物車`,
        "warn",
      );
      return;
    }
    for (let i = 0; i < selectedQuantity; i++) addCart(product);
    notify(`成功加入 ${selectedQuantity} 件 ${product.name} 到購物車`);
  };

  return (
  <AuthContext.Provider value={{ currentUser, setCurrentUser, handleLogout }}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            // element={
            //   <HomePage handleAddToCart={handleAddToCart} />
            // }
            element={<WelcomePage />}
          />
          <Route
            path="product/:id"
            element={
              <ProductDetail cart={cart} handleAddToCart={handleAddToCart} />
            }
          />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="home" element={<HomePage handleAddToCart={handleAddToCart} />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="cart"
            element={
              <CartPage
                cart={cart}
                addCart={addCart}
                removeCart={removeCart}
                removeRow={removeRow}
                checkToggle={checkToggle}
              />
            }
          />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
