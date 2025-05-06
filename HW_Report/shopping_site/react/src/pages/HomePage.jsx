import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Products from "../components/Products";
import styles from "./HomePage.module.css";

function HomePage({ handleAddToCart }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/products/?search=${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ 搜尋失敗", err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  useEffect(() => {
    handleSearch();  // 頁面載入時就先載入所有商品
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
      {loading ? (
        <p>載入中...</p>
      ) : products.length > 0 ? (
        <Products products={products} handleAddToCart={handleAddToCart} />
      ) : searched ? (
        <p>查無商品</p>
      ) : null}
    </div>
  );
}

export default HomePage;
