import axios from 'axios';

let cart = {
    items: [],
    total: 0
};

let wishlist = [];

// 초기화 함수: 서버에서 카트와 위시리스트 데이터를 불러옴
async function initCart() {
    // 카트 데이터 불러오기
    await axios.get('https://11.fesp.shop/cart')
        .then(response => {
            cart.items = response.data.items;
            updateCartView();
        })
        .catch(error => console.error('카트 데이터를 불러오는 중 오류 발생:', error));

    // 위시리스트 데이터 불러오기
    axios.get('https://11.fesp.shop/wishlist')
        .then(response => {
            wishlist = response.data.items;
            updateWishlistView();
        })
        .catch(error => console.error('위시리스트 데이터를 불러오는 중 오류 발생:', error));
}

function updateCartView() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const orderSummary = document.getElementById('order-summary');
    
    if (cart.items.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        orderSummary.style.display = 'none';
    } else {
        cartItemsContainer.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        orderSummary.style.display = 'block';
        
        cartItemsContainer.innerHTML = cart.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-option">${item.option}</div>
                    <div class="item-price">${item.price.toLocaleString()}원</div>
                    <div class="quantity-control">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="add-to-wishlist" onclick="addToWishlist(${item.id})"><img src="../assets/icons/button36px/white-heart.svg" alt="빈 하트"></button>
                    <button class="remove-item" onclick="removeItem(${item.id})">🗑️</button>
                </div>
            </div>
        `).join('');

        updateOrderSummary();
    }
}

function updateWishlistView() {
    const wishlistContainer = document.getElementById('wishlist-items');
    wishlistContainer.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-option">${item.option}</div>
                <div class="item-price">${item.price.toLocaleString()}원</div>
            </div>
            <button class="add-to-cart-button" onclick="addToCartFromWishlist(${item.id})">장바구니에 추가</button>
        </div>
    `).join('');
}

function updateOrderSummary() {
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()}원`;
    document.getElementById('total').textContent = `${subtotal.toLocaleString()}원`;
}

function changeQuantity(itemId, change) {
    const item = cart.items.find(i => i.id === itemId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCartView();

        // 서버에 변경된 수량 업데이트 요청
        axios.put(`https://11.fesp.shop/cart/${itemId}`, { quantity: item.quantity })
            .catch(error => console.error('수량 업데이트 중 오류 발생:', error));
    }
}

function updateQuantity(itemId, newQuantity) {
    const item = cart.items.find(i => i.id === itemId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity) || 1);
        updateCartView();

        // 서버에 변경된 수량 업데이트 요청
        axios.put(`https://11.fesp.shop/cart/${itemId}`, { quantity: item.quantity })
            .catch(error => console.error('수량 업데이트 중 오류 발생:', error));
    }
}

function removeItem(itemId) {
    // 카트에서 항목 제거
    cart.items = cart.items.filter(item => item.id !== itemId);
    updateCartView();

    // 서버에 아이템 제거 요청
    axios.delete(`https://11.fesp.shop/cart/${itemId}`)
        .catch(error => console.error('아이템 제거 중 오류 발생:', error));
}

function addToWishlist(itemId) {
    const item = cart.items.find(i => i.id === itemId);
    if (item && !wishlist.some(w => w.id === itemId)) {
        wishlist.push({...item, quantity: 1});
        updateWishlistView();

        // 서버에 위시리스트에 항목 추가 요청
        axios.post('https://11.fesp.shop/wishlist', item)
            .catch(error => console.error('위시리스트에 항목 추가 중 오류 발생:', error));
    }
}

function addToCartFromWishlist(itemId) {
    const item = wishlist.find(i => i.id === itemId);
    if (item) {
        const existingCartItem = cart.items.find(i => i.id === itemId);
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.items.push({...item, quantity: 1});
        }
        updateCartView();

        // 서버에 카트에 항목 추가 요청
        axios.post('https://11.fesp.shop/cart', item)
            .catch(error => console.error('카트에 항목 추가 중 오류 발생:', error));
    }
}

document.getElementById('order-button').addEventListener('click', function() {
    // 서버에 주문 요청
    axios.post('https://11.fesp.shop/order', cart)
        .then(() => alert('주문이 완료되었습니다!'))
        .catch(error => console.error('주문 중 오류 발생:', error));
});

window.onload = initCart;
