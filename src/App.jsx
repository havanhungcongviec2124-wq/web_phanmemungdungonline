import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/header';
import Foodter from './components/Foodter';
import QuickCartDrawer from './components/QuickCartDrawer';
import Toast from './components/Toast';
import { fetchProductsApi } from './redux/product/productApi';
import { fetchCategoriesApi } from './redux/category/categoryApi';
import { fetchVouchersApi } from './redux/voucher/voucherApi';
import { fetchProfileApi } from './redux/Auth/authApi';
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

  useEffect(() => {
    // Tải dữ liệu ban đầu từ Backend MongoDB
    dispatch(fetchProductsApi());
    dispatch(fetchCategoriesApi());
    dispatch(fetchVouchersApi());
    if (localStorage.getItem('luxe_token')) {
      dispatch(fetchProfileApi());
    }
  }, [dispatch]);

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