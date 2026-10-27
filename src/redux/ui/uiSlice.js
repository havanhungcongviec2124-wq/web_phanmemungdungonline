// uiSlice.js — Quản lý global UI state (toast notification, loading overlay)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: null, // { message, type: 'success' | 'error' | 'info' }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      const { message, type = 'success' } = action.payload;
      state.toast = { message, type };
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;

// Selectors
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer;
