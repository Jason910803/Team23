import Products from './Products';
function App() {
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
                <section class="categories">
                    <h2>商品分類</h2>
                    <button>電子產品</button>
                    <button>服飾</button>
                    <button>家居用品</button>
                </section>
                <Products />
            </main>
        </>
    );
}

export default App;