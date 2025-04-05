// components/Cart.jsx
import React from "react";
import styles from './Cart.module.css';

function groupCartItems(cart) {
  const cargo = new Map();
  for (const item of cart) {
    cargo.set(item.name, {
      ...item,
      amount: (cargo.get(item.name)?.amount || 0) + 1
    });
  }
  return Array.from(cargo.values());
}

function Cart({ cart, addCart, removeCart, removeRow }) {
  const products = groupCartItems(cart);
  const total = products.reduce(
    (sum, product) => sum + product.price * product.amount,
    0
  );

  const handleCheckout = () => {
    alert(`總金額：$${total.toLocaleString()}，感謝您的購買！`);
  };

  return (
    <section className={styles.cart}>
      <h1>🛒 購物車</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>商品圖片</th>
            <th>商品名稱</th>
            <th>數量</th>
            <th>價格</th>
            <th>小計</th>
            <th>刪除</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map(product =>
              product.amount < 0 ? null : (
                <tr key={product.name}>
                  <td><img src={product.image} alt={product.name} width="50" /></td>
                  <td>{product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={product.amount}
                      min="1"
                      onChange={e => {
                        const count = e.target.value - product.amount;
                        const sign = Math.sign(count);
                        for (let i = 0; i < Math.abs(count); i++) {
                          sign > 0 ? addCart(product) : removeCart(product);
                        }
                      }}
                    />
                  </td>
                  <td>${product.price.toLocaleString()}</td>
                  <td>${(product.price * product.amount).toLocaleString()}</td>
                  <td>
                    <button className={styles.removeBtn} onClick={() => removeRow(product)}>刪除</button>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>購物車目前是空的 🛒</td>
            </tr>
          )}
        </tbody>
      </table>

      {total > 0 && (
        <>
          <p className={styles.totalPrice} style={{ fontWeight: "bold", marginTop: "1rem" }}>
            總金額：${total.toLocaleString()}
          </p>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>結帳</button>
        </>
      )}
    </section>
  );
}

export default Cart;
