const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const products = {
    "1": { name: "Product 1", description: "This is the first product." },
    "2": { name: "Product 2", description: "This is the second product." },
    "3": { name: "Product 3", description: "This is the third product." },
};

if (products[productId]) {
    document.getElementById("product-name").innerText = products[productId].name;
    document.getElementById("product-description").innerText = products[productId].description;
} else {
    document.getElementById("product-name").innerText = "Product Not Found";
    document.getElementById("product-description").innerText = "We couldn't find this product.";
}