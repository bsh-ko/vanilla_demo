"use strict";
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
      _id: 1,
      user_id: 4,
      product_id: 1,
      quantity: 2,
      size: 275,
      createdAt: "2024.10.20 20:16:24",
      updatedAt: "2024.10.20 20:16:24",
      product: {
        _id: 1,
        name: "나이키 줌 보메로 5",
        price: 15000,
        seller_id: 2,
        quantity: 20,
        buyQuantity: 10,
        image: {
          path: "https://via.placeholder.com/150",
          name: "product1.jpg",
          originalname: "나이키_줌.jpg",
        },
        extra: {
          isNew: false,
          isBest: true,
          category: ["남성 신발"],
          sort: 1,
        },
        size: [250, 255, 260, 265, 270, 275, 280],
        color: "포톤 더스트/그리드아이언/세일/크롬",
        styleNo: "NIKE-ZOOM-0001",
        primeCost: 139000,
      },
      shippingFees: "무료 배송",
      deliveryDate: "7월 26일 (금)",
    },
    {
      _id: 2,
      user_id: 4,
      product_id: 2,
      quantity: 1,
      size: 275,
      createdAt: "2024.10.20 20:16:24",
      updatedAt: "2024.10.20 20:16:24",
      product: {
        _id: 2,
        name: "제품 2",
        price: 20000,
        seller_id: 2,
        quantity: 15,
        buyQuantity: 5,
        image: {
          path: "https://via.placeholder.com/150",
          name: "product2.jpg",
          originalname: "제품2.jpg",
        },
        extra: {
          isNew: true,
          isBest: false,
          category: ["남성 신발"],
          sort: 2,
        },
        size: [250, 255, 260, 265, 270, 275, 280],
        color: "포톤 더스트/그리드아이언/세일/크롬",
        styleNo: "PRODUCT2-STYLE-0002",
        primeCost: 139000,
      },
      shippingFees: "무료 배송",
      deliveryDate: "7월 26일 (금)",
    },
  ],
  total: 0,
};

let wishlist = [
  {
    _id: 9,
    user_id: 4,
    memo: "다음에 재구매",
    createdAt: "2024.04.08 16:47:46",
    product: {
      _id: 4,
      name: "레고 테크닉 42151 부가티 볼리드",
      price: 45000,
      quantity: 100,
      buyQuantity: 89,
      image: {
        url: "https://via.placeholder.com/150",
        fileName: "sample-bugatti.png",
        orgName: "부가티.png",
      },
      extra: {
        isNew: false,
        isBest: true,
        category: ["PC03", "PC0303"],
        sort: 1,
      },
    },
  },
];

function initCart() {
  updateCartView();
  updateWishlistView();
}

function updateCartView() {
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const orderSummary = document.getElementById("order-summary");

  if (cart.items.length === 0) {
    cartItemsContainer.style.display = "none";
    emptyCartMessage.style.display = "block";
    orderSummary.style.display = "none";
  } else {
    cartItemsContainer.style.display = "block";
    emptyCartMessage.style.display = "none";
    orderSummary.style.display = "block";

    cartItemsContainer.innerHTML = cart.items
      .map((item) => {
        // image 속성이 없을 경우 기본 이미지 URL 사용
        const imageUrl = item.product.image.path || "https://via.placeholder.com/150";
        const itemName = item.product.name || "이름 없는 상품";
        const itemPrice = (item.product.price || 0).toLocaleString();

        return `
            <div class="cart-item">
              <img src="${imageUrl}" alt="${itemName}">
              <div class="item-details">
                <div class="item-header">
                  <div class="item-name">${itemName}</div>
                  <div class="item-price">${itemPrice.toLocaleString()}원</div>
                </div>
                <div class="item-option">${item.product.color}</div>
                <div class="item-description">${item.product.extra.category.join(
                  ", "
                )}</div>
                <div>
                  <span class="item-size">사이즈 ${item.size}</span>
                  <div class="quantity-control">
                  <button class="button-class" onclick="changeQuantity(${
                    item._id
                  }, -1)">-</button>
                  <input type="number" value="${
                    item.quantity
                  }" min="1" onchange="updateQuantity(${item._id}, this.value)">
                  <button class="button-class" onclick="changeQuantity(${
                    item._id
                  }, 1)">+</button>
                </div>
              </div>
              <div class="item-actions">
                <button class="add-to-wishlist button-class" onclick="addToWishlist(${
                  item._id
                })">
                <img src="../../../public/assets/icons/button36px/white-heart.svg" alt="빈 하트" style="width: 24px; height: auto;"></button>
                <button class="remove-item button-class" onclick="removeItem(${
                  item._id
                })">
                  <img src="../../../public/assets/icons/button36px/delete.svg" alt="삭제" style="width: 20px; height: auto;">
                </button>
              </div>
            </div>
          </div>
          <div class="delivery-info">
            <div class="shipping-fee">${
              item.shippingFees ? item.shippingFees.toLocaleString() : 0
            }</div>
            <div class="delivery-details">도착 예정일: ${
              item.deliveryDate || "정보 없음"
            }
              <span class="region-edit"><a href="#">지역 수정</a></span> 
            </div>
          </div> 
        `;
      })
      .join("");

    updateOrderSummary();
  }
}

function updateWishlistView() {
  const wishlistContainer = document.getElementById("wishlist-items");
  wishlistContainer.innerHTML = wishlist
    .map((item) => {
      // 이미지 URL과 제품 이름이 정의되어 있는지 체크
      const imageUrl = item.product?.image?.url || "https://via.placeholder.com/150";
      const productName = item.product?.name || "이름 없는 상품";
      const productPrice =
        item.product?.price?.toLocaleString() || "가격 정보 없음";

      return `
        <div class="wishlist-item">
            <img src="${imageUrl}" alt="${productName}">
            <div class="wishlist-item-details">
                <div class="item-name">${productName}</div>
                <div class="item-price">${productPrice}원</div>
                <button class="add-to-cart-button" onclick="addToCartFromWishlist(${item.product._id})">장바구니에 추가</button>
            </div>
        </div>
      `;
    })
    .join("");
}

function updateOrderSummary() {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  document.getElementById(
    "subtotal"
  ).textContent = `${subtotal.toLocaleString()}원`;
  document.getElementById(
    "total"
  ).textContent = `${subtotal.toLocaleString()}원`;
}

function changeQuantity(itemId, change) {
  const item = cart.items.find((i) => i._id === itemId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    updateCartView();
  }
}

function updateQuantity(itemId, newQuantity) {
  const item = cart.items.find((i) => i._id === itemId);
  if (item) {
    item.quantity = Math.max(1, parseInt(newQuantity) || 1);
    updateCartView();
  }
}

function removeItem(itemId) {
  cart.items = cart.items.filter((item) => item._id !== itemId);
  updateCartView();
}

function addToWishlist(itemId) {
  const item = cart.items.find((i) => i._id === itemId);
  if (item && !wishlist.some((w) => w._id === itemId)) {
    wishlist.push({ ...item });
    updateWishlistView();
  }
}

function addToCartFromWishlist(productId) {
  const item = wishlist.find((i) => i.product?._id === productId);
  if (item && item.product) {
    const existingCartItem = cart.items.find((i) => i.product_id === productId); // 수정된 부분
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cart.items.push({
        _id: item._id,
        user_id: item.user_id,
        product_id: item.product._id,
        quantity: 1,
        size: item.size || "미설정", 
        createdAt: item.createdAt,
        updatedAt: item.createdAt,
        product: {
          ...item.product,
          image: {
            path: item.product.image.url,
            name: item.product.image.fileName,
            originalname: item.product.image.orgName,
          },
        },
        shippingFees: "무료 배송",
        deliveryDate: "7월 26일 (금)",
      });
    }
    updateCartView();
  }
}


document.getElementById("order-button").addEventListener("click", function () {
  alert("주문이 완료되었습니다!");
});

window.onload = initCart;
