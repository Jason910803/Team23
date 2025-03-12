document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const productsSection = document.querySelector('.products');
            productsSection.innerHTML = ''; // Clear existing content

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                const productImage = document.createElement('img');
                productImage.src = product.image;
                productImage.alt = product.name;

                const productName = document.createElement('h2');
                productName.textContent = product.name;

                const productPrice = document.createElement('p');
                productPrice.textContent = `價格: $${product.price}`;

                const productDetailLink = document.createElement('a');
                productDetailLink.href = 'product-detail.html?id=' + product.id; // Corrected URL
                productDetailLink.textContent = '查看詳情';

                const addToCartButton = document.createElement('button');
                addToCartButton.textContent = '加入購物車';

                productDiv.appendChild(productImage);
                productDiv.appendChild(productName);
                productDiv.appendChild(productPrice);
                productDiv.appendChild(productDetailLink);
                productDiv.appendChild(addToCartButton);

                productsSection.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error loading products:', error));
});