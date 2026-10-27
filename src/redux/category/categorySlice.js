import { createSlice } from '@reduxjs/toolkit';
import { fetchCategoriesApi } from './categoryApi';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.categories || [];
      })
      .addCase(fetchCategoriesApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCategories = (state) => state.category.items;
export const selectCategoryLoading = (state) => state.category.loading;

export default categorySlice.reducer;
