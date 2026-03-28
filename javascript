
class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}


const products = [
    new Product(1, "Wireless Headphones", 59.99, "images/headphones.jpg"),
    new Product(2, "Smart Watch", 129.99, "images/smartwatch.jpg"),
    new Product(3, "Bluetooth Speaker", 79.99, "images/speaker.jpg"),
    new Product(4, "Laptop Backpack", 49.99, "images/backpack.jpg"),
    new Product(5, "USB-C Hub", 34.99, "images/hub.jpg"),
    new Product(6, "Wireless Mouse", 24.99, "images/mouse.jpg"),
    new Product(7, "Mechanical Keyboard", 89.99, "images/keyboard.jpg"),
    new Product(8, "4K Monitor", 299.99, "images/monitor.jpg"),
    new Product(9, "External SSD", 119.99, "images/ssd.jpg"),
    new Product(10, "Phone Stand", 14.99, "images/stand.jpg"),
    new Product(11, "Screen Protector", 9.99, "images/protector.jpg"),
    new Product(12, "Charging Cable", 12.99, "images/cable.jpg")
];


let cart = [];


const currentUser = {
    name: "John Doe",
    orderHistory: []
};


function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.loading = 'lazy';
        
        
        const title = document.createElement('h3');
        const titleText = document.createTextNode(product.name);
        title.appendChild(titleText);
        
        
        const price = document.createElement('p');
        const priceText = document.createTextNode(`$${product.price.toFixed(2)}`);
        price.appendChild(priceText);
        price.className = 'price';
        
        
        const addButton = document.createElement('button');
        const buttonText = document.createTextNode('Add to Cart');
        addButton.appendChild(buttonText);
        addButton.className = 'add-to-cart-btn';
        addButton.setAttribute('data-id', product.id);
        
        
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(addButton);
        
        productGrid.appendChild(card);
    });
}


function addToCart(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
        saveCartToLocalStorage();
        
        
        const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.classList.add('fade-in');
            setTimeout(() => {
                productCard.classList.remove('fade-in');
            }, 500);
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== parseInt(productId));
    renderCart();
    saveCartToLocalStorage();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === parseInt(productId));
        if (item) {
            item.quantity = newQuantity;
            renderCart();
            saveCartToLocalStorage();
        }
    }
}

function renderCart() {
    const cartList = document.querySelector('.cart-list');
    const cartTotal = document.querySelector('.cart-total');
    
    if (!cartList) return;
    
    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty';
        emptyMessage.className = 'empty-cart';
        cartList.appendChild(emptyMessage);
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        
        const itemInfo = document.createElement('div');
        itemInfo.className = 'cart-item-info';
        
        const itemName = document.createElement('h4');
        itemName.textContent = item.name;
        
        const itemPrice = document.createElement('p');
        itemPrice.textContent = `$${item.price.toFixed(2)} each`;
        
        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemPrice);
        
        
        const quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls';
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = '0';
        quantityInput.className = 'quantity-input';
        quantityInput.addEventListener('change', (e) => {
            updateQuantity(item.id, parseInt(e.target.value));
        });
        
        const itemTotal = document.createElement('p');
        itemTotal.className = 'item-total';
        itemTotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', () => removeFromCart(item.id));
        
        quantityControls.appendChild(quantityInput);
        quantityControls.appendChild(itemTotal);
        quantityControls.appendChild(removeButton);
        
        cartItem.appendChild(itemInfo);
        cartItem.appendChild(quantityControls);
        
        cartList.appendChild(cartItem);
    });
    
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}


function setupEventDelegation() {
    document.body.addEventListener('click', (event) => {
        
        const addButton = event.target.closest('.add-to-cart-btn');
        if (addButton) {
            const productId = addButton.getAttribute('data-id');
            addToCart(productId);
            event.preventDefault();
        }
    });
}


function setupFormValidation() {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        let isValid = true;
        
        
        const nameInput = document.querySelector('#name');
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        }
        
        
        const emailInput = document.querySelector('#email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Valid email is required');
            isValid = false;
        }
        
        
        const addressInput = document.querySelector('#address');
        if (!addressInput.value.trim()) {
            showError(addressInput, 'Address is required');
            isValid = false;
        }
        
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            const paymentError = document.createElement('div');
            paymentError.className = 'error-message';
            paymentError.textContent = 'Please select a payment method';
            document.querySelector('.payment-options').appendChild(paymentError);
            isValid = false;
        }
        
        if (isValid) {
        
            const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const order = {
                date: new Date().toLocaleDateString(),
                total: orderTotal,
                items: [...cart],
                orderNumber: Math.floor(Math.random() * 1000000)
            };
            
            currentUser.orderHistory.push(order);
            saveOrderHistoryToLocalStorage();
            
            console.log('Order placed successfully!', order);
            
            
            cart = [];
            saveCartToLocalStorage();
            
            
            setTimeout(() => {
                window.location.href = 'thankyou.html';
            }, 1000);
        }
    });
}

function showError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}


function setupUserAccount() {
    
    const userGreeting = document.querySelector('.user-greeting');
    if (userGreeting) {
        userGreeting.textContent = `Welcome back, ${currentUser.name}!`;
    }
    
    
    const orderDetailsElements = document.querySelectorAll('.order-details');
    orderDetailsElements.forEach((detailsElement, index) => {
        const summary = detailsElement.querySelector('summary');
        if (summary && !summary.hasListener) {
            summary.addEventListener('click', () => {
                if (!detailsElement.hasAttribute('data-loaded')) {
                    renderOrderHistory(detailsElement, index);
                    detailsElement.setAttribute('data-loaded', 'true');
                }
            });
            summary.hasListener = true;
        }
    });
}

function renderOrderHistory(detailsElement, orderIndex) {
    if (orderIndex < currentUser.orderHistory.length) {
        const order = currentUser.orderHistory[orderIndex];
        const content = detailsElement.querySelector('.order-content') || document.createElement('div');
        content.className = 'order-content';
        
        content.innerHTML = `
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
                ${order.items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
            </ul>
        `;
        
        if (!detailsElement.querySelector('.order-content')) {
            detailsElement.appendChild(content);
        }
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
    }
}

function saveOrderHistoryToLocalStorage() {
    localStorage.setItem('orderHistory', JSON.stringify(currentUser.orderHistory));
}

function loadOrderHistoryFromLocalStorage() {
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
        currentUser.orderHistory = JSON.parse(savedOrders);
    }
}


function setupInteractiveFeedback() {
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    loadOrderHistoryFromLocalStorage();
    
    renderProducts();
    setupEventDelegation();
    setupFormValidation();
    setupUserAccount();
    setupInteractiveFeedback();
    
    if (document.querySelector('.cart-list')) {
        renderCart();
    }
});