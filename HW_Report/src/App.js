import Products from './Products';
import Cart from './Cart_react';
import { useState } from 'react';
import ContactForm from './ContactForm'; 

function App() {
    const [cart, setCart] = useState(new Array());

    function addCart(product) {
        setCart(c => c.concat(product));
    }

    function removeCart(product) {
        let idx = cart.findIndex(p => p.name === product.name);
        setCart(c => c.slice(0, idx).concat(c.slice(idx + 1)));
    }

    function removeRow(product) {
        setCart(c => c.filter(p => p.name !== product.name));
    }

    return (
        <>
            <header>
                <h1><a href="#">購物網站</a></h1>
                <nav>
                    <ul>
                        <li><a href="#">首頁</a></li>
                        <li><a href="#">商品</a></li>
                        <li><a href="#">關於我們</a></li>
                        <li><a href="#">聯絡我們</a></li>
                    </ul>
                </nav>
                <div className="search-container">
                    <input type="text" placeholder="搜尋商品..." className="search-bar" />
                    <button className="search-btn">search</button>
                </div>
            </header>

            <main>
                <section className="categories">
                    <h2>商品分類</h2>
                    <button>電子產品</button>
                    <button>服飾</button>
                    <button>家居用品</button>
                </section>

              <Products addCart={addCart}/>

              <Cart cart={cart} addCart={addCart} removeCart={removeCart} removeRow={removeRow}/>

                <section className="contact">
                    <h2>聯絡我們</h2>
                    <ContactForm />
                </section>
            </main>

            <footer>
                <p>&copy; 2025 購物網站. 版權所有.</p>
            </footer>
        </>
    );
}

export default App;
