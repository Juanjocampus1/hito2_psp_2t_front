function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function updateCartCount() {
    const cart = getCookie('cart');
    const cartCount = cart ? JSON.parse(cart).length : 0;
    document.getElementById('cart-count').textContent = cartCount;
}

document.addEventListener('DOMContentLoaded', function() {
    const userId = getCookie('userId');
    console.log('User ID from cookie:', userId);
    if (!userId) {
        alert('User not logged in');
        window.location.href = 'login.html';
    }

    updateCartCount();

    fetch('http://localhost:8081/api/product/findAll')
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById('product-container');
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'bg-slate-800 p-6 mt-16 rounded-lg shadow-lg';

                productCard.innerHTML = `
                    <h2 class="text-xl font-bold mb-2">${product.name}</h2>
                    <p class="text-gray-400 mb-4">${product.description}</p>
                    <p class="text-gray-400 font-bold mb-4">€${product.price}</p>
                    <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-2" onclick="buyProduct(${product.id})">Buy</button>
                    <button class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600" onclick="addToCart(${product.id})">Add to Cart</button>
                `;

                productContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});

function buyProduct(productId) {
    setCookie('productId', productId, 1); // Set cookie for 1 day
    window.location.href = 'shop.html';
}

function addToCart(productId) {
    let cart = getCookie('cart');
    cart = cart ? JSON.parse(cart) : [];
    cart.push(productId);
    setCookie('cart', JSON.stringify(cart), 7); // Set cookie for 7 days
    updateCartCount();
    alert('Product added to cart');
}