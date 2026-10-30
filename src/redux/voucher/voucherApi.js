// voucherApi.js — createAsyncThunk cho Voucher API
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('luxe_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Lấy danh sách voucher đang hoạt động
export const fetchVouchersApi = createAsyncThunk(
  'voucher/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/vouchers`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể lấy danh sách voucher');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Validate + áp dụng voucher
export const validateVoucherApi = createAsyncThunk(
  'voucher/validate',
  async ({ code, subtotal }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/vouchers/validate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Mã giảm giá không hợp lệ');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
