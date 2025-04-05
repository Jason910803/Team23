import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Products from '../components/Products';
import Cart from '../components/Cart';
import styles from './HomePage.module.css';  // ✅ 匯入 CSS Module

function HomePage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.log('Error fetching products:', err));
  }, []);

  const addCart = product => setCart(c => [...c, product]);
  const removeCart = product => {
    const idx = cart.findIndex(p => p.name === product.name);
    setCart(c => [...c.slice(0, idx), ...c.slice(idx + 1)]);
  };
  const removeRow = product => {
    setCart(c => c.filter(p => p.name !== product.name));
  };

  return (
    <div className={styles.pageWrapper}>
      <Products products={products} addCart={addCart} />
      <Cart cart={cart} addCart={addCart} removeCart={removeCart} removeRow={removeRow} />
    </div>
  );
}

export default HomePage;
