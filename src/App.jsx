import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/header';
import Foodter from './components/Foodter';
import QuickCartDrawer from './components/QuickCartDrawer';
import Toast from './components/Toast';
import { fetchProductsApi } from './redux/product/productApi';
import { fetchCategoriesApi } from './redux/category/categoryApi';
import { fetchVouchersApi } from './redux/voucher/voucherApi';
import { fetchProfileApi } from './redux/Auth/authApi';
import { selectCurrentUser } from './redux/Auth/authSlice';
import { loadCartForUser, clearCartFromMemory } from './redux/cart/cartSlice';
import './index.css';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  // Track previous userId to detect login/logout changes
  const prevUserIdRef = useRef(undefined);

  // Load initial data on mount
  useEffect(() => {
    dispatch(fetchProductsApi());
    dispatch(fetchCategoriesApi());
    dispatch(fetchVouchersApi());
    if (localStorage.getItem('luxe_token')) {
      dispatch(fetchProfileApi());
    }
  }, [dispatch]);

  // Khi user thay đổi (login / logout / switch account) → nạp đúng giỏ hàng
  useEffect(() => {
    const currentUserId = currentUser?.id || currentUser?._id || null;
    const prevUserId = prevUserIdRef.current;

    // Lần đầu khởi động (undefined) — skip để tránh ghi đè state ban đầu
    if (prevUserId === undefined) {
      prevUserIdRef.current = currentUserId;
      return;
    }

    // Chỉ xử lý khi userId thực sự thay đổi
    if (prevUserId !== currentUserId) {
      if (currentUserId) {
        // Người dùng vừa đăng nhập → load giỏ hàng của họ
        dispatch(loadCartForUser(currentUserId));
      } else {
        // Người dùng vừa đăng xuất → xóa giỏ hàng khỏi memory
        dispatch(clearCartFromMemory());
      }
      prevUserIdRef.current = currentUserId;
    }
  }, [currentUser, dispatch]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <div className="min-h-screen bg-[#FAF7F2] font-sans">
          <Outlet />
          <Toast />
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Foodter />
        <QuickCartDrawer />
        <Toast />
      </div>
    </>
  );
};

export default App;