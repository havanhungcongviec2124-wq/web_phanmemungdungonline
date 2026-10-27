// voucherSlice.js — Quản lý voucher đang được áp dụng và danh sách voucher
import { createSlice } from '@reduxjs/toolkit';
import { validateVoucherApi, fetchVouchersApi } from './voucherApi';

const initialState = {
  vouchers: [],
  appliedVoucher: null,
  loading: false,
  error: null,
};

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    removeVoucher: (state) => {
      state.appliedVoucher = null;
      state.error = null;
    },
    clearVoucherError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vouchers
      .addCase(fetchVouchersApi.fulfilled, (state, action) => {
        if (action.payload?.vouchers) {
          state.vouchers = action.payload.vouchers;
        }
      })
      // Validate voucher
      .addCase(validateVoucherApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateVoucherApi.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success && action.payload?.voucher) {
          state.appliedVoucher = action.payload.voucher;
        }
      })
      .addCase(validateVoucherApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.appliedVoucher = null;
      });
  },
});

export const { removeVoucher, clearVoucherError } = voucherSlice.actions;

// Selectors
export const selectVouchers = (state) => state.voucher.vouchers;
export const selectAppliedVoucher = (state) => state.voucher.appliedVoucher;
export const selectVoucherLoading = (state) => state.voucher.loading;
export const selectVoucherError = (state) => state.voucher.error;

export default voucherSlice.reducer;
