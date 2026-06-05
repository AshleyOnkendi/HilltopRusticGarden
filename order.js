document.addEventListener('DOMContentLoaded', () => {
    
    const cart = {};
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Add to Cart Logic
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            const id = menuItem.dataset.id;
            const name = menuItem.dataset.name;
            const price = parseInt(menuItem.dataset.price);
            
            if (cart[id]) {
                cart[id].quantity += 1;
            } else {
                cart[id] = { name, price, quantity: 1 };
            }
            
            updateCartUI();
        });
    });
    
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let hasItems = false;
        
        for (const [id, item] of Object.entries(cart)) {
            hasItems = true;
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-name">
                        <div>${item.name}</div>
                        <div style="font-size: 0.85rem; color: var(--clr-text-light);">Ksh ${item.price} x ${item.quantity} = Ksh ${itemTotal}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="cart-btn" onclick="updateQuantity('${id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-btn" onclick="updateQuantity('${id}', 1)">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        }
        
        if (!hasItems) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        }
        
        cartTotalElement.textContent = `Ksh ${total.toLocaleString()}`;
    }
    
    // Expose updateQuantity to global window scope for the inline onclick handlers
    window.updateQuantity = function(id, change) {
        if (cart[id]) {
            cart[id].quantity += change;
            if (cart[id].quantity <= 0) {
                delete cart[id];
            }
            updateCartUI();
        }
    };
    
    // Checkout Logic
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (Object.keys(cart).length === 0) {
            alert("Please add items to your cart first!");
            return;
        }
        
        const name = document.getElementById('custName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const location = document.getElementById('custLocation').value.trim();
        const notes = document.getElementById('custNotes').value.trim();
        
        let orderText = `*NEW DELIVERY ORDER*\n\n`;
        let total = 0;
        
        for (const [id, item] of Object.entries(cart)) {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            orderText += `- ${item.quantity}x ${item.name} (Ksh ${itemTotal})\n`;
        }
        
        orderText += `\n*Total: Ksh ${total.toLocaleString()}*\n\n`;
        orderText += `*Customer Details:*\n`;
        orderText += `Name: ${name}\n`;
        orderText += `Phone: ${phone}\n`;
        orderText += `Location: ${location}\n`;
        
        if (notes) {
            orderText += `Notes: ${notes}\n`;
        }
        
        const encodedText = encodeURIComponent(orderText);
        const whatsappNumber = "254739931886";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        
        window.open(whatsappUrl, '_blank');
    });
});
