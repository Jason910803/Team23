import React from 'react';

function Products({ products, addCart }){
    return (
        <section className="products">
            {products.length > 0 ? (
                products.map(product => (
                    <div key={product.id} className="product">
                      <img src={product.image} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>價格: ${product.price}</p>
                        <a href={`product-detail.html?id=${product.id}`}>查看詳情</a>
                      <button onClick={() => addCart(product)}>加入購物車</button>
                    </div>
                ))
            ) : (
                <p>載入中...</p>
            )}
        </section>
    )
}

export default Products;
