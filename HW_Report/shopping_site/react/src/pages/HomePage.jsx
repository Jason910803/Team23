import React from "react";
import Products from "../components/Products";
import styles from "./HomePage.module.css"; // ✅ 匯入 CSS Module

function HomePage({ products, handleAddToCart }) {
  return (
    <div className={styles.pageWrapper}>
      <form className="d-flex justify-content-center" role="search">
        <input
          className="form-control me-2 w-50"
          type="search"
          placeholder="搜尋商品"
          aria-label="Search"
        />
        <button className="btn-dark" type="submit">
          Search
        </button>
      </form>
      <Products products={products} handleAddToCart={handleAddToCart} />
    </div>
  );
}

export default HomePage;
