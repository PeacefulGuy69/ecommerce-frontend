document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('productList');
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading products...';
    productList.appendChild(loadingMessage);

    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            productList.removeChild(loadingMessage); // Remove loading message

            products.forEach(product => {
                // Create product list item
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');

                // Create product item inner HTML with image, title, price, and link to product detail page
                productItem.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}" loading="lazy" />
                    </div>
                    <div class="product-info">
                        <a href="product.html?id=${product.id}" class="product-link">
                            <h3>${product.title}</h3>
                            <p>$${product.price.toFixed(2)}</p>
                        </a>
                        <button class="add-to-cart" aria-label="Add ${product.title} to cart">Add to Cart</button>
                    </div>
                `;

                // Add Add to Cart button functionality
                const button = productItem.querySelector('.add-to-cart');
                button.addEventListener('click', () => addToCart(product));

                productList.appendChild(productItem);
            });

            updateCartCount(); // Update cart count after loading products
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            productList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
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
