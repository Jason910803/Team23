import React from "react";
import styles from "./SearchBar.module.css"; // ✅ 引入 CSS module

function SearchBar({ query, setQuery, onSearch }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch();
    };
  
    return (
      <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
        <input
          className={`form-control ${styles.searchInput}`}
          type="search"
          placeholder="搜尋商品"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </form>
    );
  }
  
  export default SearchBar;
