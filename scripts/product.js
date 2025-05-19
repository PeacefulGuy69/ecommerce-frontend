document.addEventListener('DOMContentLoaded', function () {
    const detailContainer = document.getElementById('detailContainer');

    // Hamburger menu toggle for product.html header
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Check if product ID is specified
    if (!productId) {
        detailContainer.innerHTML = '<p>Product ID not specified.</p>';
        return; // Exit if no product ID is found
    }

    // Show loading message
    detailContainer.innerHTML = '<p>Loading product details...</p>';

    // Fetch product detail from API
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(product => {
            detailContainer.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" id="mainImage" />
                </div>
                <div class="product-info">
                    <h1>${product.title}</h1>
                    <p class="price">$<span id="productPrice">${product.price.toFixed(2)}</span></p>
                    <p class="description">${product.description}</p>
                    <div class="variations">
                        <label for="size">Size:</label>
                        <select id="size">
                            <option value="S">Small</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                        </select>
                    </div>
                    <div class="quantity-selector">
                        <button id="decreaseQty">−</button>
                        <input type="number" id="quantity" value="1" min="1" max="10" />
                        <button id="increaseQty">+</button>
                    </div>
                    <button class="add-to-cart" aria-label="Add ${product.title} to cart">Add to Cart</button>
                </div>
            `;

            // Image zoom effect
            const mainImage = document.getElementById('mainImage');
            mainImage.addEventListener('mouseover', () => {
                mainImage.style.transform = 'scale(1.5)';
                mainImage.style.transition = 'transform 0.5s ease';
            });
            mainImage.addEventListener('mouseout', () => {
                mainImage.style.transform = 'scale(1)';
            });

            // Quantity selector functionality
            const quantityInput = document.getElementById('quantity');
            const decreaseQtyButton = document.getElementById('decreaseQty');
            const increaseQtyButton = document.getElementById('increaseQty');

            decreaseQtyButton.addEventListener('click', () => {
                if (quantityInput.value > 1) {
                    quantityInput.value--;
                    updatePrice(product.price);
                }
            });

            increaseQtyButton.addEventListener('click', () => {
                if (quantityInput.value < 10) {
                    quantityInput.value++;
                    updatePrice(product.price);
                }
            });

            // Update price based on quantity input change
            quantityInput.addEventListener('input', () => {
                if (quantityInput.value < 1) quantityInput.value = 1;
                else if (quantityInput.value > 10) quantityInput.value = 10;
                updatePrice(product.price);
            });

            // Add to cart functionality
            const addToCartButton = detailContainer.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', () => {
                addToCart(product, quantityInput.value);
            });

            updateCartCount();
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            detailContainer.innerHTML = '<p>Failed to load product details. Please try again later.</p>';
        });

    // Update total price based on quantity
    function updatePrice(price) {
        const quantity = document.getElementById('quantity').value;
        const totalPrice = price * quantity;
        document.getElementById('productPrice').textContent = totalPrice.toFixed(2);
    }

    // Add product to cart with quantity and size
    function addToCart(product, quantity) {
        const sizeSelect = document.getElementById('size');
        const selectedSize = sizeSelect ? sizeSelect.value : '';

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if product with same id and size exists, update quantity
        const existingIndex = cart.findIndex(
            item => item.id === product.id && item.selectedSize === selectedSize
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += parseInt(quantity);
        } else {
            const cartItem = {
                ...product,
                quantity: parseInt(quantity),
                selectedSize: selectedSize
            };
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Item added to cart!');
    }

    // Update cart count in header
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    updateCartCount();
});
