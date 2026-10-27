// orderApi.js — createAsyncThunk cho Order API
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('luxe_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Tạo đơn hàng mới
export const createOrderApi = createAsyncThunk(
  'order/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đặt hàng thất bại');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Lấy danh sách đơn hàng (user tự xem hoặc admin xem tất cả)
export const fetchOrdersApi = createAsyncThunk(
  'order/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params);
      const res = await fetch(`${BASE_URL}/orders?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi lấy đơn hàng');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatusApi = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status, note = '' }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật trạng thái');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
