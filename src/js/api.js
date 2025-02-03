
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  document.addEventListener('DOMContentLoaded', function() {
    const productId = getCookie('productId');
    if (!productId) {
      alert('No product selected');
      window.location.href = 'index.html';
      return;
    }

    fetch(`http://localhost:8081/api/product/find/${productId}`)
      .then(response => response.json())
      .then(product => {
        const productDetails = document.getElementById('product-details');
        productDetails.innerHTML = `
          <h1 class="text-4xl font-bold mb-4">${product.name}</h1>
          <p class="text-gray-700 mb-4">${product.description}</p>
          <p class="text-gray-900 font-bold text-2xl mb-4">$${product.price}</p>
          <p class="text-gray-600 mb-4">Stock: ${product.stock}</p>
          <button class="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600">Buy Now</button>
        `;
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  });