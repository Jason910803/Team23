// pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // ✅ 加入 Link
import styles from "./ProductDetail.module.css";

function ProductDetail({ cart, handleAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        if (data && data.stock > 0) {
          setSelectedQuantity(1);
        }
      });
  }, [id]);

  const handleQuantityChange = (event) => {
    setSelectedQuantity(parseInt(event.target.value, 10));
  };

  if (!product) return <p className="text-center mt-5">載入中...</p>;

  const stockCount = product.stock || 0;

  return (
    <div className="container mt-5">
      <div className={styles.productDetail}>
        <h1 className="mb-4 text-center">{product.name}</h1>
        <img src={product.image} alt={product.name} className={styles.image} />
        <p className="mt-3">{product.description}</p>
        <p className={styles.price}>${product.price}</p>

        <div className="d-flex justify-content-center align-items-center gap-2">
          {stockCount > 0 ? (
            <>
              <select
                className="form-select"
                style={{ width: "auto" }}
                value={selectedQuantity}
                onChange={handleQuantityChange}
                aria-label="Select quantity"
              >
                {[...Array(stockCount)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-primary "
                style={{ marginTop: "0px" }}
                onClick={() => handleAddToCart(product, selectedQuantity)}
                type="button"
              >
                加入購物車
              </button>
            </>
          ) : (
            <span className="input-group-text">缺貨中</span>
          )}
          <Link to="/home" className="btn btn-secondary" role="button">
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
