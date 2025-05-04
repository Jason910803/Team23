import React from "react";
import { Link } from "react-router-dom";
import styles from "./Products.module.css";

function Products({ products, handleAddToCart }) {
  // 🔸 Group products by category_name
  const grouped = products.reduce((acc, product) => {
    const category = product.category_name || "未分類";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <section className={styles.products}>
      {Object.keys(grouped).map((category) => (
        <div key={category} className={styles.categoryBlock}>
          <h3 className={styles.categoryTitle}>{category}</h3>
          <div className={styles.productGrid}>
            {grouped[category].map((product) => (
              <div key={product.id} className={styles.product}>
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                  <h2>{product.name}</h2>
                  <h2 className={styles.price}>${product.price}</h2>
                </Link>
                <button onClick={() => handleAddToCart(product)}>加入購物車</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Products;
