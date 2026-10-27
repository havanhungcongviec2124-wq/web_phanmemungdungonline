// orderSlice.js — createSlice quản lý state đơn hàng
import { createSlice } from '@reduxjs/toolkit';
import { createOrderApi, fetchOrdersApi, updateOrderStatusApi } from './orderApi';

const initialState = {
  items: [],           // Danh sách đơn hàng
  createdOrder: null,  // Đơn hàng vừa đặt thành công
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCreatedOrder: (state) => {
      state.createdOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // createOrderApi
    builder
      .addCase(createOrderApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderApi.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success && action.payload?.order) {
          state.createdOrder = action.payload.order;
          state.items = [action.payload.order, ...state.items];
        }
      })
      .addCase(createOrderApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchOrdersApi
    builder
      .addCase(fetchOrdersApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders || [];
      })
      .addCase(fetchOrdersApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateOrderStatusApi
    builder
      .addCase(updateOrderStatusApi.fulfilled, (state, action) => {
        const updated = action.payload.order;
        if (updated) {
          state.items = state.items.map((o) =>
            o._id === updated._id ? updated : o
          );
        }
      });
  },
});

export const { clearCreatedOrder, clearOrderError } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.order.items;
export const selectCreatedOrder = (state) => state.order.createdOrder;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;

export default orderSlice.reducer;
