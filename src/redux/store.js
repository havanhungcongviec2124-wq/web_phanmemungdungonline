// store.js — Redux Store kết hợp tất cả slices
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice';
import productReducer from './product/productSlice';
import categoryReducer from './category/categorySlice';
import orderReducer from './order/orderSlice';
import cartReducer from './cart/cartSlice';
import voucherReducer from './voucher/voucherSlice';
import uiReducer from './ui/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    order: orderReducer,
    cart: cartReducer,
    voucher: voucherReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua kiểm tra serializable cho các action này (nếu cần)
        ignoredActions: [],
      },
    }),
});

export default store;
