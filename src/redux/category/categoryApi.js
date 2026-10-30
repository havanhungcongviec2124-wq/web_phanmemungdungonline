// categoryApi.js — createAsyncThunk cho Category API
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('luxe_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Lấy tất cả danh mục
export const fetchCategoriesApi = createAsyncThunk(
  'category/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi lấy danh mục');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
