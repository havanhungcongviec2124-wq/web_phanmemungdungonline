// cartSlice.js — Giỏ hàng riêng cho từng tài khoản (theo userId)
import { createSlice } from '@reduxjs/toolkit';

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Tạo localStorage key riêng cho từng user
const getCartKey = (userId) =>
  userId ? `luxe_cart_${userId}` : 'luxe_cart_guest';

const getWishlistKey = (userId) =>
  userId ? `luxe_wishlist_${userId}` : 'luxe_wishlist_guest';

// Lấy userId từ localStorage (nếu đã đăng nhập trước đó)
const getSavedUserId = () => {
  try {
    const saved = localStorage.getItem('luxe_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user?.id || user?._id || null;
    }
  } catch {
    // ignore
  }
  return null;
};

const loadCartForId = (userId) => {
  try {
    const key = getCartKey(userId);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadWishlistForId = (userId) => {
  try {
    const key = getWishlistKey(userId);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Khởi tạo state theo user đang đăng nhập (nếu có)
const savedUserId = getSavedUserId();

const initialState = {
  userId: savedUserId,          // userId hiện tại để ghi đúng key
  items: loadCartForId(savedUserId),
  wishlist: loadWishlistForId(savedUserId),
  isDrawerOpen: false,
};

// ─── Helpers lưu state ───────────────────────────────────────────────────────

const saveCartToStorage = (userId, items) => {
  try {
    localStorage.setItem(getCartKey(userId), JSON.stringify(items));
  } catch {
    // ignore
  }
};

const saveWishlistToStorage = (userId, wishlist) => {
  try {
    localStorage.setItem(getWishlistKey(userId), JSON.stringify(wishlist));
  } catch {
    // ignore
  }
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Gọi sau khi đăng nhập / đăng xuất để nạp đúng giỏ hàng của user đó
    loadCartForUser: (state, action) => {
      const userId = action.payload || null; // null = guest
      state.userId = userId;
      state.items = loadCartForId(userId);
      state.wishlist = loadWishlistForId(userId);
    },

    // Xóa cart khỏi memory khi logout (dữ liệu vẫn giữ trong localStorage)
    clearCartFromMemory: (state) => {
      state.userId = null;
      state.items = [];
      state.wishlist = [];
    },

    // Thêm sản phẩm vào giỏ
    addToCart: (state, action) => {
      const { product, size = 'Tiêu chuẩn', color = 'Tiêu chuẩn', quantity = 1 } = action.payload;
      const pId = product._id || product.id;
      const existIdx = state.items.findIndex(
        (item) => item.id === pId && item.size === size && item.color === color
      );
      if (existIdx > -1) {
        state.items[existIdx].quantity += quantity;
      } else {
        state.items.push({
          id: pId,
          productId: pId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          color,
          size,
          quantity,
          image: product.images?.[0] || '',
          categoryName: product.categoryName,
          giftType: product.giftType || 'single',
        });
      }
      saveCartToStorage(state.userId, state.items);
    },

    // Cập nhật số lượng theo index
    updateQuantity: (state, action) => {
      const { index, delta } = action.payload;
      const newQty = state.items[index].quantity + delta;
      if (newQty <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = newQty;
      }
      saveCartToStorage(state.userId, state.items);
    },

    // Xóa sản phẩm theo index
    removeFromCart: (state, action) => {
      state.items.splice(action.payload, 1);
      saveCartToStorage(state.userId, state.items);
    },

    // Xóa toàn bộ giỏ hàng (sau khi đặt hàng xong)
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.userId, []);
    },

    // Toggle wishlist
    toggleWishlist: (state, action) => {
      const id = String(action.payload);
      const idx = state.wishlist.indexOf(id);
      if (idx > -1) {
        state.wishlist.splice(idx, 1);
      } else {
        state.wishlist.push(id);
      }
      saveWishlistToStorage(state.userId, state.wishlist);
    },

    // Mở / đóng drawer giỏ hàng
    setDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const {
  loadCartForUser,
  clearCartFromMemory,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  toggleWishlist,
  setDrawerOpen,
} = cartSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items;
export const selectWishlist = (state) => state.cart.wishlist;
export const selectIsDrawerOpen = (state) => state.cart.isDrawerOpen;
export const selectIsWishlisted = (productId) => (state) =>
  state.cart.wishlist.includes(String(productId));

export const selectTotalItemsCount = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectSubtotal = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

export const selectShippingFee = (state) => {
  const subtotal = selectSubtotal(state);
  const voucher = state.voucher?.appliedVoucher;
  return subtotal >= 1000000 || voucher?.isShipping || state.cart.items.length === 0
    ? 0
    : 35000;
};

export const selectDiscountAmount = (state) => {
  const voucher = state.voucher?.appliedVoucher;
  if (!voucher) return 0;
  const subtotal = selectSubtotal(state);
  if (voucher.isShipping) return 35000;
  const raw = Math.round((subtotal * voucher.discount) / 100);
  return voucher.maxDiscount ? Math.min(raw, voucher.maxDiscount) : raw;
};

export const selectTotal = (state) => {
  const subtotal = selectSubtotal(state);
  const shippingFee = selectShippingFee(state);
  const discount = selectDiscountAmount(state);
  const voucher = state.voucher?.appliedVoucher;
  return Math.max(0, subtotal + shippingFee - (voucher?.isShipping ? 0 : discount));
};

export default cartSlice.reducer;
