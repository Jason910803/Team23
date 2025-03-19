import React, { useState, useEffect } from 'react';

function App() {
    const [products, setProducts] = useState([]);

    // Fetch products when the component mounts
    useEffect(() => {
        fetch('/products.json') // Updated path to fetch from the public folder
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error loading products:', error));
    }, []);

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
            <section className="products">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="product">
                            <img src={product.image} alt={product.name} />
                            <h2>{product.name}</h2>
                            <p>價格: ${product.price}</p>
                            <a href={`product-detail.html?id=${product.id}`}>查看詳情</a>
                            <button>加入購物車</button>
                        </div>
                    ))
                ) : (
                    <p>載入中...</p>
                )}
            </section>
        </>
    );
}

export default App;