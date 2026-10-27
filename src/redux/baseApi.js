// RTK Query base API — tất cả endpoint chia sẻ base URL và auth header
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:5000/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Lấy token từ Redux state hoặc localStorage
      const token =
        getState()?.auth?.token || localStorage.getItem('luxe_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Tag types để auto-refetch khi data thay đổi
  tagTypes: ['Product', 'Category', 'Order', 'Voucher', 'User'],
  endpoints: () => ({}),
});
