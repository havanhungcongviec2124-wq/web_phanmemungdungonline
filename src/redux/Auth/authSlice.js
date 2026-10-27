// authSlice.js — Redux slice quản lý auth state
import { createSlice } from '@reduxjs/toolkit';
import { loginApi, registerApi, demoLoginApi, fetchProfileApi } from './authAPI';

const initialState = {
  currentUser: (() => {
    const saved = localStorage.getItem('luxe_user');
    if (saved) { try { return JSON.parse(saved); } catch { return null; } }
    return null;
  })(),
  token: localStorage.getItem('luxe_token') || null,
  loading: false,
  error: null,
};

const handleAuthFulfilled = (state, action) => {
  state.loading = false;
  state.error = null;
  if (action.payload?.token) {
    state.token = action.payload.token;
    state.currentUser = action.payload.user;
    localStorage.setItem('luxe_token', action.payload.token);
    localStorage.setItem('luxe_user', JSON.stringify(action.payload.user));
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('luxe_token');
      localStorage.removeItem('luxe_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // loginApi
    builder
      .addCase(loginApi.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginApi.fulfilled, handleAuthFulfilled)
      .addCase(loginApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // registerApi
    builder
      .addCase(registerApi.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerApi.fulfilled, handleAuthFulfilled)
      .addCase(registerApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // demoLoginApi
    builder
      .addCase(demoLoginApi.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(demoLoginApi.fulfilled, handleAuthFulfilled)
      .addCase(demoLoginApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchProfileApi
    builder
      .addCase(fetchProfileApi.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.currentUser = action.payload.user;
          localStorage.setItem('luxe_user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(fetchProfileApi.rejected, (state) => {
        // Token hết hạn → tự động logout
        state.currentUser = null;
        state.token = null;
        localStorage.removeItem('luxe_token');
        localStorage.removeItem('luxe_user');
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.currentUser?.role === 'admin';
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;

export default authSlice.reducer;
