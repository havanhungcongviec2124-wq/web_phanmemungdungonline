// productSlice.js — createSlice quản lý state sản phẩm
import { createSlice } from '@reduxjs/toolkit';
import { fetchProductsApi, fetchProductByIdApi, updateProductApi } from './productApi';

const initialState = {
  items: [],          // Danh sách sản phẩm hiển thị
  selectedProduct: null, // Sản phẩm đang xem chi tiết
  total: 0,
  loading: false,
  error: null,
  // UI filters
  filters: {
    category: 'all',
    search: '',
    sort: 'default',
    tag: '',
    page: 1,
    limit: 12,
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProductsApi
    builder
      .addCase(fetchProductsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchProductsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchProductByIdApi
    builder
      .addCase(fetchProductByIdApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByIdApi.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product || null;
      })
      .addCase(fetchProductByIdApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateProductApi (Admin toggle stock)
    builder
      .addCase(updateProductApi.fulfilled, (state, action) => {
        const updated = action.payload.product;
        if (updated) {
          state.items = state.items.map((p) =>
            p._id === updated._id ? updated : p
          );
          if (state.selectedProduct?._id === updated._id) {
            state.selectedProduct = updated;
          }
        }
      });
  },
});

export const { setFilter, setPage, resetFilters, clearSelectedProduct } = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.product.items;
export const selectSelectedProduct = (state) => state.product.selectedProduct;
export const selectProductTotal = (state) => state.product.total;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
export const selectProductFilters = (state) => state.product.filters;

export default productSlice.reducer;
