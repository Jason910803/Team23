function App() {
    return (
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
    );
}
export default App;