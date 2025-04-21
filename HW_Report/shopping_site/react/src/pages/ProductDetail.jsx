// pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // ✅ 加入 Link
import styles from "./ProductDetail.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductDetail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);

	useEffect(() => {
		fetch(`http://localhost:8000/api/products/${id}/`)
			.then((res) => res.json())
			.then((data) => setProduct(data));
	}, [id]);

	if (!product) return <p className="text-center mt-5">載入中...</p>;

	return (
		<div className="container mt-5">
			<div className={styles.productDetail}>
				<h1 className="mb-4 text-center">{product.name}</h1>
				<img src={product.image} alt={product.name} className={styles.image} />
				<p className="mt-3">{product.description}</p>
				<p className={styles.price}>${product.price}</p>

				{/* 🔙 返回首頁按鈕 */}
				<div className="text-center mt-4">
					<Link to="/" className="btn btn-secondary">
						返回首頁
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ProductDetail;
