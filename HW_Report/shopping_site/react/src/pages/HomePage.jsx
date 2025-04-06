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

  const checkToggle = (product, value) => {
    let idx = cart.findIndex(p => p.id === product.id);
    setCart(c => c.with(idx, {...product, checked: value ?? !c.at(idx).checked}));
  }

  const addCart = (product) => {
    let idx = cart.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      setCart(c => c.with(
        idx,
        {...product, amount: c.at(idx).amount + 1}
      ));
    } else {
      setCart(c => c.concat({...product, amount: 1, checked: false}));
    }
  }

  const removeCart = (product) => {
    let idx = cart.findIndex(p => p.id === product.id);
    setCart(c => c.with(
      idx,
      {...product, amount: c.at(idx).amount - 1}
    ));
  }

  const removeRow = (product) => {
    setCart(c => c.filter(p => p.id !== product.id));
  }


  return (
    <div className={styles.pageWrapper}>
      <Products products={products} addCart={addCart} />
      <Cart cart={cart} addCart={addCart} removeCart={removeCart} removeRow={removeRow} checkToggle={checkToggle}/>
    </div>
  );
}

export default HomePage;
