// productApi.js — createAsyncThunk cho Product API
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('luxe_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Lấy metadata lọc sản phẩm (dịp lễ, khoảng giá, loại quà) từ backend
export const fetchProductMetaApi = createAsyncThunk(
  'product/fetchMeta',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/products/meta`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi lấy metadata sản phẩm');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Lấy danh sách sản phẩm (có filter, search, sort, pagination)
export const fetchProductsApi = createAsyncThunk(
  'product/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '' && v !== 'all') {
          query.append(k, v);
        }
      });
      const res = await fetch(`${BASE_URL}/products?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi lấy sản phẩm');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Lấy chi tiết 1 sản phẩm theo id
export const fetchProductByIdApi = createAsyncThunk(
  'product/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không tìm thấy sản phẩm');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Cập nhật sản phẩm — chủ yếu dùng cho Admin cập nhật tồn kho & sửa thông tin
export const updateProductApi = createAsyncThunk(
  'product/update',
  async ({ id, ...productData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật sản phẩm');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Tạo sản phẩm mới (Admin nhập hàng mới)
export const createProductApi = createAsyncThunk(
  'product/create',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi thêm sản phẩm mới');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Xóa sản phẩm
export const deleteProductApi = createAsyncThunk(
  'product/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi xóa sản phẩm');
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
