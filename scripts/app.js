document.addEventListener('DOMContentLoaded', function () {
  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('active');
  });

  // Product grid dynamic loading
  const productGrid = document.getElementById('productGrid');
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Loading products...';
  productGrid.appendChild(loadingMessage);

  fetch('https://fakestoreapi.com/products')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(products => {
      productGrid.removeChild(loadingMessage);

      products.forEach(product => {
        // Create product card container
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Create product card inner HTML with link to product detail page
        productCard.innerHTML = `
          <a href="product.html?id=${product.id}" class="product-link">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
          </a>
          <button class="add-to-cart" aria-label="Add ${product.title} to cart">Add to Cart</button>
        `;

        // Add Add to Cart button functionality (optional enhancement)
        const button = productCard.querySelector('.add-to-cart');
        button.addEventListener('click', () => addToCart(product));

        productGrid.appendChild(productCard);
      });

      updateCartCount();
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
      productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    });

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount.textContent = cart.length;
  }
});
