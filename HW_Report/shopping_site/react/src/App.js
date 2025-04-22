import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import { ToastContainer } from "react-toastify";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(
    localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [],
  );

  localStorage.setItem("cart", JSON.stringify(cart));

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log("Error fetching products:", err));
  }, []);

  const checkToggle = (product, value) => {
    let idx = cart.findIndex((p) => p.id === product.id);
    setCart((c) =>
      c.with(idx, { ...product, checked: value ?? !c.at(idx).checked }),
    );
  };

  const addCart = (product) => {
    let idx = cart.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      setCart((c) => {
        let newAmount = c.at(idx).amount + 1;
        if (newAmount > product.stock) newAmount = product.stock;
        return c.with(idx, { ...product, amount: newAmount });
      });
    } else {
      setCart((c) => c.concat({ ...product, amount: 1, checked: false }));
    }
  };

  const removeCart = (product) => {
    let idx = cart.findIndex((p) => p.id === product.id);
    setCart((c) => c.with(idx, { ...product, amount: c.at(idx).amount - 1 }));
  };

  const removeRow = (product) => {
    setCart((c) => c.filter((p) => p.id !== product.id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<HomePage products={products} addCart={addCart} />}
          />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
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
  );
}

export default App;
