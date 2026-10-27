// cartSlice.js — Quản lý giỏ hàng (local state, persist vào localStorage)
import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadWishlist = () => {
  try {
    const saved = localStorage.getItem('luxe_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadCart(),
  wishlist: loadWishlist(),
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ
    addToCart: (state, action) => {
      const { product, size = 'M', color = 'Be', quantity = 1 } = action.payload;
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
        });
      }
      localStorage.setItem('luxe_cart', JSON.stringify(state.items));
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
      localStorage.setItem('luxe_cart', JSON.stringify(state.items));
    },

    // Xóa sản phẩm theo index
    removeFromCart: (state, action) => {
      state.items.splice(action.payload, 1);
      localStorage.setItem('luxe_cart', JSON.stringify(state.items));
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('luxe_cart');
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
      localStorage.setItem('luxe_wishlist', JSON.stringify(state.wishlist));
    },

    // Mở / đóng drawer giỏ hàng
    setDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  toggleWishlist,
  setDrawerOpen,
} = cartSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items;
export const selectWishlist = (state) => state.cart.wishlist;
export const selectIsDrawerOpen = (state) => state.cart.isDrawerOpen;
export const selectIsWishlisted = (productId) => (state) =>
  state.cart.wishlist.includes(String(productId));

// Tính toán (derived state)
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
