// components/Cart.jsx
import React from "react";
import styles from './Cart.module.css';

// product : {name, id, price, image}
// cart :  { ...product, amount }

function Cart({ cart, addCart, removeCart, removeRow, checkToggle }) {
  const total = cart.filter(p => p.checked).reduce(
    (sum, product) => sum + product.price * product.amount,
    0
  );

  const handleAmountSelect = (e, product) => {
    let op = addCart;
    let diff = e.target.value - product.amount;
    if (diff < 0) {
      op = removeCart;
      diff = -diff;
    }
    [...Array(diff)].map(() => op(product));
  }

  const handleCheckout = () => {
    alert(`總金額：$${total.toLocaleString()}，感謝您的購買！`);
  };

  return (
    <section className={styles.cart}>
      <h1>🛒 購物車</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={cart.length > 0 && cart.every(product => product.checked)}
                onChange={e => cart.map(product => checkToggle(product, e.target.checked))}
              />
            </th>
            <th>商品圖片</th>
            <th>商品名稱</th>
            <th>數量</th>
            <th>價格</th>
            <th>小計</th>
            <th>刪除</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map(product =>
              product.amount < 0 ? null : (
                <tr key={product.name}>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.checked}
                      onChange={e => checkToggle(product, e.target.checked)}
                      />
                  </td>
                  <td><img src={product.image} alt={product.name} width="50" /></td>
                  <td>{product.name}</td>
                  <td>
                    <select
                      className="amount-select"
                      value={product.amount}
                      onChange={e => handleAmountSelect(e, product)}>
                      {
                        [...Array(product.stock)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))
                      }
                    </select>
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
              <td colSpan="7" style={{ textAlign: "center" }}>購物車目前是空的 🛒</td>
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
