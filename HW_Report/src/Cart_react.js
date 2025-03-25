import React from "react";

// product : {name, id, price, image}
// cart :  { ...product, amount }

export default function Cart({ cart, addCart, removeCart, removeRow }) {
  let cargo = new Map();
  for (let product of cart) {
    cargo.set(product.name, {
      ...product,
      amount: (cargo.has(product.name) ? cargo.get(product.name).amount : 0) + 1,
    });
  }

  const products = Array.from(cargo.values());
  const total = products.reduce(
    (sum, product) => sum + product.price * product.amount,
    0
  );

  function handleCheckout() {
    alert(`總金額：$${total.toLocaleString()}，感謝您的購買！`);
  }

  return (
    <section className="cart">
      <h1>🛒 購物車</h1>
      <table>
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
            products.map((product) =>
              product.amount < 0 ? null : (
                <tr key={product.name}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      width="50"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={product.amount}
                      min="1"
                      onChange={(e) => {
                        let count = e.target.value - product.amount;
                        let sign = Math.sign(count);
                        for (let i = 0; i < Math.abs(count); i++) {
                          sign > 0 ? addCart(product) : removeCart(product);
                        }
                      }}
                    />
                  </td>
                  <td>${product.price.toLocaleString()}</td>
                  <td className="subtotal">
                    ${(product.price * product.amount).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeRow(product)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                購物車目前是空的 🛒
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {total > 0 && (
        <>
          <p
            className="total-price"
            style={{ fontWeight: "bold", marginTop: "1rem" }}
          >
            總金額：${total.toLocaleString()}
          </p>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
          >
            結帳
          </button>
        </>
      )}
    </section>
  );
}
