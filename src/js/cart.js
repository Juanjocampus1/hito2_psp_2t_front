function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function updateCartCount() {
  const cart = getCookie('cart');
  const cartCount = cart ? JSON.parse(cart).length : 0;
  document.getElementById('cart-count').textContent = cartCount;
}

function updatePaymentSummary() {
  const productQuantities = getCookie('productQuantities');
  const productDetails = getCookie('productDetails');

  if (!productQuantities || !productDetails) {
      console.warn("No hay datos en las cookies.");
      return;
  }

  const quantities = JSON.parse(productQuantities);
  const products = JSON.parse(productDetails);
  let subtotal = 0;

  products.forEach(product => {
      const quantityObj = quantities.find(q => q.id === product.id);
      if (quantityObj) {
          subtotal += product.price * quantityObj.quantity;
      }
  });

  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `Subtotal: €${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `Tax (21%): €${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `Total: €${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();

  const cart = getCookie('cart');
  if (!cart) {
      alert('Your cart is empty');
      return;
  }

  const productQuantities = JSON.parse(cart);
  const cartContainer = document.getElementById('cart-container');
  const productDetails = [];
  const quantitiesArray = [];

  productQuantities.forEach(item => {
      fetch(`http://localhost:8081/api/product/find/${item}`)
          .then(response => response.json())
          .then(product => {
              productDetails.push(product);
              quantitiesArray.push({ id: product.id, quantity: item.quantity });

              const productCard = document.createElement('div');
              productCard.className = 'bg-slate-800 p-6 rounded-lg shadow-lg';
              productCard.id = `product-${product.id}`;

              productCard.innerHTML = `
                  <h2 class="text-xl font-bold mb-2">${product.name}</h2>
                  <p class="text-gray-400 mb-4">${product.description}</p>
                  <p class="text-gray-400 font-bold mb-4">€${product.price}</p>
                  <p class="text-gray-400 mb-4">Stock: ${product.stock}</p>
                  <label for="quantity-${product.id}" class="text-gray-400 mb-2">Quantity:</label>
                  <input type="number" id="quantity-${product.id}" class="bg-gray-700 text-white p-2 rounded mb-4" 
                         value="${item.quantity}" min="1" max="${product.stock}" 
                         onchange="updateQuantity(${product.id}, ${product.price})">
                  <button class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600" 
                          onclick="removeFromCart(${product.id})">Remove</button>
              `;

              cartContainer.appendChild(productCard);

              // Guardar detalles y cantidades en cookies
              setCookie('productDetails', JSON.stringify(productDetails), 7);
              setCookie('productQuantities', JSON.stringify(quantitiesArray), 7);
              updatePaymentSummary();
          })
          .catch(error => {
              console.error('Error fetching product:', error);
          });
  });
});

function updateQuantity(productId, price) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const newQuantity = parseInt(quantityInput.value);

  let productQuantities = getCookie('productQuantities');
  productQuantities = productQuantities ? JSON.parse(productQuantities) : [];

  const index = productQuantities.findIndex(item => item.id === productId);
  if (index !== -1) {
      productQuantities[index].quantity = newQuantity;
  } else {
      productQuantities.push({ id: productId, quantity: newQuantity });
  }

  setCookie('productQuantities', JSON.stringify(productQuantities), 7);
  updatePaymentSummary();
}

function removeFromCart(productId) {
  let cart = getCookie('cart');
  let productQuantities = getCookie('productQuantities');

  cart = cart ? JSON.parse(cart) : [];
  productQuantities = productQuantities ? JSON.parse(productQuantities) : [];

  cart = cart.filter(item => item.id !== productId);
  productQuantities = productQuantities.filter(item => item.id !== productId);

  setCookie('cart', JSON.stringify(cart), 7);
  setCookie('productQuantities', JSON.stringify(productQuantities), 7);

  const productCard = document.getElementById(`product-${productId}`);
  if (productCard) {
      productCard.remove();
  }

  updateCartCount();
  updatePaymentSummary();
}
