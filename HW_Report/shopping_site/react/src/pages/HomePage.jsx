import axios from "axios";
import React, { useEffect, useState } from "react";
import Cart from "../components/Cart";
import Products from "../components/Products";
import styles from "./HomePage.module.css"; // ✅ 匯入 CSS Module

function HomePage() {
	const [cart, setCart] = useState([]);
	const [products, setProducts] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/products/")
			.then((res) => setProducts(res.data))
			.catch((err) => console.log("Error fetching products:", err));
	}, []);

	const checkToggle = (product, value) => {
		const idx = cart.findIndex((p) => p.id === product.id);
		setCart((c) =>
			c.with(idx, { ...product, checked: value ?? !c.at(idx).checked }),
		);
	};

	const addCart = (product) => {
		const idx = cart.findIndex((p) => p.id === product.id);
		if (idx !== -1) {
			setCart((c) => {
				let newAmount = c.at(idx).amount + 1;
				if (newAmount > product.stock) newAmount = product.stock;
				return c.with(idx, { ...product, amount: newAmount });
			});
		} else {
			setCart((c) => c.concat({ ...product, amount: 1, checked: false }));
		}
	};

	const removeCart = (product) => {
		const idx = cart.findIndex((p) => p.id === product.id);
		setCart((c) => c.with(idx, { ...product, amount: c.at(idx).amount - 1 }));
	};

	const removeRow = (product) => {
		setCart((c) => c.filter((p) => p.id !== product.id));
	};

	return (
		<div className={styles.pageWrapper}>
			<Products products={products} addCart={addCart} />
			<Cart
				cart={cart}
				addCart={addCart}
				removeCart={removeCart}
				removeRow={removeRow}
				checkToggle={checkToggle}
			/>
		</div>
	);
}

export default HomePage;
