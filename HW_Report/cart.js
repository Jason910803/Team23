document.addEventListener("DOMContentLoaded", function () {
    const cartTable = document.querySelector("tbody");
    const totalPriceElement = document.getElementById("total-price");

    function updateTotal() {
        let total = 0;
        document.querySelectorAll(".subtotal").forEach(subtotalElement => {
            total += parseInt(subtotalElement.textContent.replace("$", "").replace(",", ""));
        });
        totalPriceElement.textContent = `$${total.toLocaleString()}`;
    }

    function addToCart(productName, price, imageUrl) {
        const existingRow = [...cartTable.querySelectorAll("tr")].find(row =>
            row.querySelector("td:nth-child(2)").textContent === productName
        );

        if (existingRow) {
            const quantityInput = existingRow.querySelector("input");
            quantityInput.value = parseInt(quantityInput.value) + 1;
            const newSubtotal = parseInt(quantityInput.value) * price;
            existingRow.querySelector(".subtotal").textContent = `$${newSubtotal.toLocaleString()}`;
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${imageUrl}" alt="${productName}" width="50"></td>
                <td>${productName}</td>
                <td><input type="number" value="1" min="1"></td>
                <td>$${price.toLocaleString()}</td>
                <td class="subtotal">$${price.toLocaleString()}</td>
                <td><button class="remove-btn">刪除</button></td>
            `;
            cartTable.appendChild(row);
        }
        updateTotal();
    }

    document.querySelectorAll(".product button").forEach(button => {
        button.addEventListener("click", function () {
            const productElement = this.closest(".product");
            const productName = productElement.querySelector("h2").textContent;
            const price = parseInt(productElement.querySelector("p").textContent.replace("價格: $", "").replace(",", ""));
            const imageUrl = productElement.querySelector("img").src;  // 取得圖片 URL
            addToCart(productName, price, imageUrl);
        });
    });

    cartTable.addEventListener("input", function (event) {
        if (event.target.type === "number") {
            const quantity = parseInt(event.target.value);
            if (quantity < 1) {
                event.target.value = 1;
                return;
            }

            const row = event.target.closest("tr");
            const price = parseInt(row.cells[3].textContent.replace("$", "").replace(",", ""));
            row.querySelector(".subtotal").textContent = `$${(price * quantity).toLocaleString()}`;
            updateTotal();
        }
    });

    cartTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const row = event.target.closest("tr");
            row.remove();
            updateTotal();
        }
    });

    updateTotal();
});
