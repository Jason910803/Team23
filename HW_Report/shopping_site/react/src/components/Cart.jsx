// components/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";

// product : {name, id, price, image}
// cart :  { ...product, amount }

function Cart({ cart, addCart, removeCart, removeRow, checkToggle }) {
  const navigate = useNavigate();
  const total = cart
    .filter((p) => p.checked)
    .reduce((sum, product) => sum + product.price * product.amount, 0);

  const checkedItemsCount = cart
    .filter((p) => p.checked)
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAmountSelect = (e, product) => {
    let op = addCart;
    let diff = e.target.value - product.amount;
    if (diff < 0) {
      op = removeCart;
      diff = -diff;
    }
    [...Array(diff)].map(() => op(product));
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/home");
  };

  return (
    <section className={styles.cart}>
      <h1>購物車</h1>
      {cart.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    cart.length > 0 && cart.every((product) => product.checked)
                  }
                  onChange={(e) =>
                    cart.map((product) =>
                      checkToggle(product, e.target.checked),
                    )
                  }
                />
              </th>
              <th>商品圖片</th>
              <th>商品名稱</th>
              <th>數量</th>
              <th>單價</th>
              <th>小計</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((product) =>
              product.amount < 0 ? null : (
                <tr key={product.name}>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.checked}
                      onChange={(e) => checkToggle(product, e.target.checked)}
                    />
                  </td>
                  <td>
                    <img src={product.image} alt={product.name} />
                  </td>
                  <td>
                    <div className={styles.productName}>{product.name}</div>
                  </td>
                  <td>
                    <div>
                      <select
                        className={styles.quantitySelect}
                        value={product.amount}
                        onChange={(e) => handleAmountSelect(e, product)}
                      >
                        {[...Array(product.stock)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className={styles.price}>
                      ${product.price.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className={styles.subtotal}>
                      ${(product.price * product.amount).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeRow(product)}
                      aria-label="刪除商品"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      ) : (
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <h3>購物車目前是空的</h3>
          <p>找些喜歡的商品來放進購物車吧！</p>
          <button
            className={styles.continueShoppingBtn}
            onClick={handleContinueShopping}
          >
            開始購物
          </button>
        </div>
      )}

      {cart.length > 0 && (
        <div className={styles.cartSummary}>
          <div className={styles.totalRow}>
            <span>已選商品數量:</span>
            <span>{checkedItemsCount} 件</span>
          </div>
          <div className={styles.totalRow}>
            <span>商品金額:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className={styles.totalRow}>
            <span>運費:</span>
            <span>$0</span>
          </div>
          <div className={`${styles.totalRow} ${styles.totalPrice}`}>
            <span>總金額:</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.continueShoppingBtn}
              onClick={handleContinueShopping}
            >
              繼續購物
            </button>
            <button
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={total === 0}
            >
              前往結帳
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
