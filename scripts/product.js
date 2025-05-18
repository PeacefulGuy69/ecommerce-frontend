document.addEventListener('DOMContentLoaded', function () {
  const detailContainer = document.getElementById('detailContainer');

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    detailContainer.innerHTML = '<p>Product ID not specified.</p>';
    return;
  }

  detailContainer.innerHTML = '<p>Loading product details...</p>';

  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(product => {
      const variations = ['Red', 'Blue', 'Green'];
      const sizes = ['S', 'M', 'L'];
      let selectedVariation = variations[0];
      let selectedSize = sizes[0];
      let quantity = 1;

      const renderDetail = () => {
        const totalPrice = (product.price * quantity).toFixed(2);
        detailContainer.innerHTML = `
          <div class="product-detail">
            <div class="product-image zoom-container">
              <img id="productImage" src="${product.image}" alt="${product.title}" />
            </div>
            <div class="product-info">
              <h1>${product.title}</h1>
              <p class="description">${product.description}</p>
              <div class="variation-selectors">
                <label>Color:
                  <select id="variationSelect">
                    ${variations.map(v => `<option ${v === selectedVariation ? "selected" : ""}>${v}</option>`).join('')}
                  </select>
                </label>
                <label>Size:
                  <select id="sizeSelect">
                    ${sizes.map(s => `<option ${s === selectedSize ? "selected" : ""}>${s}</option>`).join('')}
                  </select>
                </label>
              </div>
              <div class="quantity-selector">
                <button id="decreaseQty">−</button>
                <input type="text" id="quantityInput" value="${quantity}" readonly />
                <button id="increaseQty">+</button>
              </div>
              <p class="price">Total: $<span id="totalPrice">${totalPrice}</span></p>
              <button class="add-to-cart" aria-label="Add to cart">Add to Cart</button>
              <div id="confirmation" style="display:none; color:green; margin-top:10px;">Added to cart!</div>
            </div>
          </div>
        `;

        // Image zoom
        const img = document.getElementById('productImage');
        img.addEventListener('mousemove', e => {
          const rect = e.target.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          img.style.transformOrigin = `${x}% ${y}%`;
          img.style.transform = 'scale(2)';
        });
        img.addEventListener('mouseleave', () => {
          img.style.transform = 'scale(1)';
        });

        // Variation & size select
        document.getElementById('variationSelect').addEventListener('change', e => {
          selectedVariation = e.target.value;
        });
        document.getElementById('sizeSelect').addEventListener('change', e => {
          selectedSize = e.target.value;
        });

        // Quantity selector
        document.getElementById('increaseQty').addEventListener('click', () => {
          quantity++;
          updateDisplay();
        });
        document.getElementById('decreaseQty').addEventListener('click', () => {
          if (quantity > 1) quantity--;
          updateDisplay();
        });

        const updateDisplay = () => {
          document.getElementById('quantityInput').value = quantity;
          document.getElementById('totalPrice').innerText = (product.price * quantity).toFixed(2);
        };

        // Add to cart
        document.querySelector('.add-to-cart').addEventListener('click', () => {
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity,
            variation: selectedVariation,
            size: selectedSize,
            image: product.image
          });
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartCount();
          document.getElementById('confirmation').style.display = 'block';
          setTimeout(() => document.getElementById('confirmation').style.display = 'none', 2000);
        });
      };

      renderDetail();
    })
    .catch(error => {
      console.error('Error loading product details:', error);
      detailContainer.innerHTML = '<p>Failed to load product details. Please try again later.</p>';
    });

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = count;
  }
});
