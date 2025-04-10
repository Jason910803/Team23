import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Products.module.css';

function Products({ products, addCart }) {
  return (
    <section className={styles.products}>
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id} className={styles.product}>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>價格: ${product.price}</p>
            <Link to={`/product/${product.id}`}>查看詳情</Link>
            <button onClick={() => addCart(product)}>加入購物車</button>
          </div>
        ))
      ) : (
        <p>載入中...</p>
      )}
    </section>
  );
}

export default Products;

