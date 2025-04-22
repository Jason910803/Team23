// pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { useParams, Link } from "react-router-dom"; // ✅ 加入 Link
import styles from "./ProductDetail.module.css";

function ProductDetail({ cart, addCart }) {
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

  const handleAddToCart = () => {
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
                onClick={handleAddToCart}
                type="button"
              >
                加入購物車
              </button>
            </>
          ) : (
            <span className="input-group-text">缺貨中</span>
          )}
          <Link to="/" className="btn btn-secondary" role="button">
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
