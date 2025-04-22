window.onload = function() {
    const productsContainer = document.getElementById('productsContainer');

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                
                // Check if the product is already in the cart
                const isProductInCart = isProductInCartLogic(product.id);
                
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button class="${isProductInCart ? 'added' : ''}" data-product-id="${product.id}">
                        ${isProductInCart ? 'Added' : 'Add to Cart'}
                    </button>
                `;

                const button = productCard.querySelector('button');
                
                // Add to cart functionality
                button.addEventListener('click', () => {
                    if (isProductInCart) {
                        return;  // Do nothing if already added
                    }
                    addToCart(product);
                    button.classList.add('added');
                    button.innerText = 'Added';
                });

                productsContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
};

// Check if the product is in the cart
function isProductInCartLogic(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.some(item => item.id === productId);
}

// Add product to the cart
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}