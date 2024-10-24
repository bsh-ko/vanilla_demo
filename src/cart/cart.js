'use strict';
// import axios from 'axios';

// export default function api(method, url, data) {
//   return axios({
//     method,
//     url: "https://11.fesp.shop/${url}",
//     data,
//     headers: {
//       'Content-Type': 'application/json',
//       'client-id': 'vanilla01',
//     },
//   });
// }

let cart = {
  items: [
    {
      id: 1,
      name: '나이키 줌 보메로 5',
      option: '남성 신발',
      description: '포톤 더스트/그리드아이언/세일/크롬',
      size: 275,
      price: 15000,
      quantity: 2,
      image: 'https://via.placeholder.com/150',
      shippingfee: '무료 배송',
      deliveryDate: '7월 26일 (금)',
    },
    {
      id: 2,
      name: '제품 2',
      option: '남성 신발',
      description: '포톤 더스트/그리드아이언/세일/크롬',
      size: 275,
      price: 20000,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
      shippingfee: '무료 배송',
      deliveryDate: '7월 26일 (금)',
    },
  ],
  total: 0,
};

let wishlist = [
  {
    id: 3,
    name: '위시리스트 제품 1',
    option: '남성 신발',
    price: 30000,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: '위시리스트 제품 2',
    option: '남성 신발',
    price: 25000,
    image: 'https://via.placeholder.com/150',
  },
];

function initCart() {
  updateCartView();
  updateWishlistView();
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

    cartItemsContainer.innerHTML = cart.items
      .map(
        item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-header">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${item.price.toLocaleString()}원</div>
                    </div>
                    <div class="item-option">${item.option}</div>
                    <div class="item-description">${item.description}</div>
                    <div>
                        <span class="item-size">사이즈 ${item.size}</span>
                        <div class="quantity-control">
                            <button class="button-class" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                            <button class="button-class" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="add-to-wishlist button-class" onclick="addToWishlist(${item.id})">
                            <img src="../../../public/assets/icons/button36px/white-heart.svg" alt="빈 하트" style="width: 24px; height: auto;">
                        </button>
                        <button class="remove-item button-class" onclick="removeItem(${item.id})">
                            <img src="../../../public/assets/icons/button36px/delete.svg" alt="삭제" style="width: 20px; height: auto;">
                        </button>
                    </div>
                </div>
            </div>
            <div class="delivery-info">
                <div class="shipping-fee">${item.shippingfee}</div>
                <div class="delivery-details">
                    도착 예정일: ${item.deliveryDate}
                    <span class="region-edit">
                    <a href="#">지역 수정</a>
                    </span> 
                </div>
            </div>
        `,
      )
      .join('');

    updateOrderSummary();
  }
}

function updateWishlistView() {
  const wishlistContainer = document.getElementById('wishlist-items');
  wishlistContainer.innerHTML = wishlist
    .map(
      item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-option">${item.option}</div>
                <div class="item-price">${item.price.toLocaleString()}원</div>
                <button class="add-to-cart-button" onclick="addToCartFromWishlist(${item.id})">장바구니에 추가</button>
            </div>
            
        </div>
    `,
    )
    .join('');
}

function updateOrderSummary() {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  document.getElementById('subtotal').textContent =
    `${subtotal.toLocaleString()}원`;
  document.getElementById('total').textContent =
    `${subtotal.toLocaleString()}원`;
}

function changeQuantity(itemId, change) {
  const item = cart.items.find(i => i.id === itemId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    updateCartView();
  }
}

function updateQuantity(itemId, newQuantity) {
  const item = cart.items.find(i => i.id === itemId);
  if (item) {
    item.quantity = Math.max(1, parseInt(newQuantity) || 1);
    updateCartView();
  }
}

function removeItem(itemId) {
  // 카트에서 항목 제거
  cart.items = cart.items.filter(item => item.id !== itemId);
  updateCartView();
}

function addToWishlist(itemId) {
  const item = cart.items.find(i => i.id === itemId);
  if (item && !wishlist.some(w => w.id === itemId)) {
    wishlist.push({ ...item, quantity: 1 });
    updateWishlistView();
  }
}

function addToCartFromWishlist(itemId) {
  const item = wishlist.find(i => i.id === itemId);
  if (item) {
    const existingCartItem = cart.items.find(i => i.id === itemId);
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }
    updateCartView();
  }
}

document.getElementById('order-button').addEventListener('click', function () {
  alert('주문이 완료되었습니다!');
});

window.onload = initCart;
