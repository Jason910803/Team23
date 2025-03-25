import React, { useState } from "react";

// product : {name, id, price, image}
// cart :  { ...product, amount}


export default function Cart({ cart, addCart, removeCart , removeRow }) {
  let cargo = new Map();
  for (let product of cart) {
      cargo.set(product.name, {  //
        ...product,
        amount: (cargo.has(product.name) ? cargo.get(product.name).amount : 0) + 1,
      });
  }

  let [c, setC] = useState(cargo);

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
          {cargo.values().map(product => (
            product.amount < 0 ? null :
              <tr key={product.name}>
                <td>
                  <img src={product.image} alt={product.name} width="50" />
                </td>
                <td>{product.name}</td>
                <td>
                  <input type="number"
                         value={product.amount}
                         min="1"
                         onChange={e => {
                           let count = e.target.value - product.amount;
                           let sign = Math.sign(e.target.value - product.amount);
                           for (let i = 0; i < parseInt(sign * count); i++)
                             if (sign > 0) {
                               addCart(product);
                             } else {
                               removeCart(product);
                             }
                           }}
                  />
                </td>
                <td>${product.price.toLocaleString()}</td>
                <td className="subtotal">${(product.price * product.amount).toLocaleString()}</td>
                <td>
                  <button className="remove-btn" onClick={() => removeRow(product)}>刪除</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>
  );
}
