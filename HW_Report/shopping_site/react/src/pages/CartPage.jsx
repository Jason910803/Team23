import Cart from "../components/Cart";

function CartPage({ cart, addCart, removeCart, removeRow, checkToggle }) {
  return (
    <Cart
      cart={cart}
      addCart={addCart}
      removeCart={removeCart}
      removeRow={removeRow}
      checkToggle={checkToggle}
    />
  );
}

export default CartPage;
