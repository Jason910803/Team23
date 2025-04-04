import React from "react";

// product : {name, id, price, image}
// cart :  { ...product, amount }

function Cart({ cart, addCart, removeCart, removeRow, checkToggle }) {
  const total = cart.filter(p => p.checked).reduce(
    (sum, product) => sum + product.price * product.amount,
    0
  );

  function handleAmountSelect(e, product) {
    let op = addCart;
    let diff = e.target.value - product.amount;
    if (diff < 0) {
      op = removeCart;
      diff = -diff;
    }
    [...Array(diff)].map(() => op(product));
  }

  function handleCheckout() {
    cart.filter(p => p.checked).map(p => removeRow(p));
    alert(`總金額：$${total.toLocaleString()}，感謝您的購買！`);
  }

  return (
    <section className="cart">
      <h1>🛒 購物車</h1>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={cart.length > 0 && cart.every(p => p.checked)}
                onChange={e => cart.map(p => checkToggle(p, e.target.checked))}
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
          {
            (cart.length > 0) ?
              (
                cart.map(p =>
                  (p.amount > 0) && (
                    <tr key={p.name}>
                      <td>
                        <input
                          type="checkbox"
                          checked={p.checked}
                          onChange={e => checkToggle(p, e.target.checked)}
                        />
                      </td>
                      <td>
                        <img src={p.image} alt={p.name} width="50"/>
                      </td>
                      <td>{p.name}</td>
                      <td>
                        <select
                          className="amount-select"
                          value={p.amount}
                          onChange={e => handleAmountSelect(e, p)}>
                          {
                            [...Array(p.stock)].map((_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1}
                              </option>
                            ))
                          }
                        </select>
                      </td>
                      <td>${p.price.toLocaleString()}</td>
                      <td className="subtotal">
                        ${(p.price * p.amount).toLocaleString()}
                      </td>
                      <td>
                        <button className="remove-btn" onClick={() => removeRow(p)}>
                          刪除
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) :
              (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    購物車目前是空的 🛒
                  </td>
                </tr>
              )
          }
        </tbody>
      </table>
      {
        (total > 0) &&
          (
            <>
              <p className="total-price" style={{ fontWeight: "bold", marginTop: "1rem" }}>
                總金額：${total.toLocaleString()}
              </p>

              <button className="checkout-btn" onClick={handleCheckout}>
                結帳
              </button>
            </>
          )
      }
    </section>
  );
}

export default Cart;
