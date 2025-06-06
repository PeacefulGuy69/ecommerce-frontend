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
            productGrid.removeChild(loadingMessage); // Remove loading message

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

                // Add Add to Cart button functionality
                const button = productCard.querySelector('.add-to-cart');
                button.addEventListener('click', () => addToCart(product));

                productGrid.appendChild(productCard);
            });

            updateCartCount(); // Update cart count after loading products
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        });

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1; // Increment quantity if already in cart
        } else {
            product.quantity = 1; // Set initial quantity
            cart.push(product); // Add new product to cart
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Item added to cart!');
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalItems; // Update the cart count display
    }
});
