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

    // 使用事件委託監聽 "加入購物車" 按鈕的點擊事件
    document.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON" && event.target.textContent === "加入購物車") {
            const button = event.target;
            const productName = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const imageUrl = button.dataset.image;
            addToCart(productName, price, imageUrl);
        }
    });

    // 監聽數量變更
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

    // 監聽刪除按鈕
    cartTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const row = event.target.closest("tr");
            row.remove();
            updateTotal();
        }
    });

    updateTotal();
});
