document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutButton = document.getElementById('checkoutButton');
    const continueShoppingButton = document.getElementById('continueShopping');

    // Load cart items from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    // Function to update cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" />
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>Size: ${item.selectedSize}</p>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <div class="quantity-selector">
                        <button class="decreaseQty">−</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" class="quantityInput" />
                        <button class="increaseQty">+</button>
                    </div>
                    <button class="removeItem">Remove</button>
                </div>
            `;

            // Add event listeners for quantity and remove buttons
            cartItem.querySelector('.decreaseQty').addEventListener('click', () => updateQuantity(item.id, -1));
            cartItem.querySelector('.increaseQty').addEventListener('click', () => updateQuantity(item.id, 1));
            cartItem.querySelector('.removeItem').addEventListener('click', () => removeItem(item.id));

            cartItemsContainer.appendChild(cartItem);
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);
        checkoutButton.disabled = cart.length === 0; // Disable checkout if cart is empty
        updateCartCount(); // Update cart count display
    }

    // Function to update quantity
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;

            // Prevent quantity from going below 1
            if (cart[itemIndex].quantity < 1) {
                removeItem(productId); // Remove item if quantity is less than 1
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }

    // Function to remove item from cart and then refresh the page
    function removeItem(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload(); // Refresh the page after removing the item
    }

    // Continue shopping button functionality
    continueShoppingButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirect to product page
    });

    // Function to update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalItems; // Update the cart count display
    }
});

