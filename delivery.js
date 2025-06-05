document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("home-products")) {
        loadProducts();
    }
    if (document.getElementById("product-list")) {
        loadShopProducts();
    }
    if (document.getElementById("cart-items")) {
        loadCart();
    }
});

const products = [
    { name: "Oversized Washed Wyoming Print T-shirt ", price: 280.00, image: "Oversized Washed Wyoming Print T-shirt | boohooMAN USA.jpg" },
    { name: "Medium Washed Denim Jorts", price: 500.00, image: "Unknown-12 copy 2.jpg" },
    { name: "Pablo Short Sleeve Shirt", price: 350.00, image: "Cotton On Men - Pablo Short Sleeve Shirt - Off white cable border.jpg" },
    { name: "Medium Washed Denim Jorts", price: 500.00, image: "Unknown-12 copy 2.jpg" },
    { name: "Medium Washed Denim Jorts", price: 500.00, image: "Unknown-12 copy 2.jpg" },
    { name: "Medium Washed Denim Jorts", price: 500.00, image: "Unknown-12 copy 2.jpg" },
    { name: "Medium Washed Denim Jorts", price: 500.00, image: "Unknown-12 copy 2.jpg" },
];

function loadProducts() {
    const productList = document.getElementById("home-products");
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>R${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

function loadShopProducts() {
    const shopList = document.getElementById("product-list");
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>R${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        `;
        shopList.appendChild(productDiv);
    });
}

function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name: productName, price: productPrice });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}

function loadCart() {
    const cartItems = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.innerHTML = "";
    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(listItem);
    });
}

function checkout() {
    alert("Proceeding to checkout...");
    localStorage.removeItem("cart");
    loadCart();
}

function fetchOrderHistory() {
    alert("Fetching order history...");
}