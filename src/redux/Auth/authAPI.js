// authApi.js — createAsyncThunk cho Auth API
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('luxe_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Đăng nhập
export const loginApi = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Đăng ký
export const registerApi = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password, phone }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Demo Login (1-click)
export const demoLoginApi = createAsyncThunk(
  'auth/demoLogin',
  async (role = 'customer', { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Demo login thất bại');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Lấy profile user hiện tại
export const fetchProfileApi = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể lấy thông tin user');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
