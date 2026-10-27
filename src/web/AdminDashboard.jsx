import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from './admin/AdminSidebar';
import AdminHeader from './admin/AdminHeader';
import AdminDashboardView from './admin/AdminDashboardView';
import AdminProductsView from './admin/AdminProductsView';
import AdminOrdersView from './admin/AdminOrdersView';
import AdminInventoryView from './admin/AdminInventoryView';
import AdminReportsView from './admin/AdminReportsView';
import { fetchProductsApi } from '../redux/product/productApi';
import { fetchOrdersApi } from '../redux/order/orderApi';
import { selectCurrentUser } from '../redux/Auth/authSlice';
import { demoLoginApi } from '../redux/Auth/authApi';
import { showToast } from '../redux/ui/uiSlice';
import { ShieldAlert, Database, Server, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tab: paramTab } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = paramTab || searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(currentTab);

  const currentUser = useSelector(selectCurrentUser);

  // Sync tab with URL searchParams and route params
  useEffect(() => {
    const tabFromUrl = paramTab || searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [paramTab, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (paramTab) {
      navigate(`/admin/${tabId}`);
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  useEffect(() => {
    dispatch(fetchProductsApi());
    dispatch(fetchOrdersApi());
  }, [dispatch]);

  // Header titles by tab
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Tổng Quan Kinh Doanh',
          subtitle: 'Theo dõi chỉ số doanh thu, đơn hàng và lượng bán theo thời gian thực.',
        };
      case 'products':
        return {
          title: 'Quản Lý Sản Phẩm',
          subtitle: 'Danh mục thiết kế thời trang, định giá và cấu hình hiển thị.',
        };
      case 'orders':
        return {
          title: 'Quản Lý Đơn Hàng',
          subtitle: 'Theo dõi tiến độ xử lý đơn, xác nhận thanh toán và lịch sử giao hàng.',
        };
      case 'inventory':
        return {
          title: 'Quản Lý Kho Hàng',
          subtitle: 'Kiểm soát số lượng tồn thực tế và cảnh báo nhập hàng theo từng phân loại.',
        };
      case 'reports':
        return {
          title: 'Báo Cáo Doanh Thu',
          subtitle: 'Phân tích tăng trưởng tài chính, tỷ trọng kênh bán và hiệu suất kinh doanh.',
        };
      case 'settings':
        return {
          title: 'Cài Đặt Hệ Thống',
          subtitle: 'Kết nối cơ sở dữ liệu MongoDB Atlas, phân quyền và thông tin thương hiệu.',
        };
      default:
        return {
          title: 'Tổng Quan Kinh Doanh',
          subtitle: '',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#18181B] font-sans">
      {/* 1. Left Dark Sidebar (Exact Figma) */}
      <AdminSidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <AdminHeader
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Admin Demo Privileges Bar if not logged in as admin */}
          {currentUser?.role !== 'admin' && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 text-amber-900 text-xs">
                <ShieldAlert className="text-amber-600 shrink-0" size={18} />
                <span>
                  Bạn đang xem với tư cách Khách. Để có quyền cập nhật đơn hàng & tồn kho trực tiếp vào MongoDB Atlas:
                </span>
              </div>
              <button
                onClick={() => {
                  dispatch(demoLoginApi('admin'));
                  dispatch(showToast({ message: 'Đã kích hoạt phiên làm việc Admin Demo!', type: 'success' }));
                }}
                className="px-4 py-2 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Kích Hoạt Quyền Admin Demo (1-Click)
              </button>
            </div>
          )}

          {/* Tab Views */}
          {activeTab === 'dashboard' && (
            <AdminDashboardView onNavigateTab={handleTabChange} />
          )}

          {activeTab === 'products' && (
            <AdminProductsView />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersView />
          )}

          {activeTab === 'inventory' && (
            <AdminInventoryView />
          )}

          {activeTab === 'reports' && (
            <AdminReportsView />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-8 space-y-6 animate-fade-in max-w-3xl">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xs bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Trạng Thái Kết Nối MongoDB Atlas</h3>
                  <p className="text-xs text-gray-500">Cụm máy chủ lưu trữ dữ liệu thời gian thực</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-xs space-y-1">
                  <span className="text-gray-500 block">Trạng thái máy chủ</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Đang hoạt động (Connected)
                  </span>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-xs space-y-1">
                  <span className="text-gray-500 block">Cơ sở dữ liệu</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    mongodb+srv://.../luxe_store
                  </span>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-xs space-y-1">
                  <span className="text-gray-500 block">Tài khoản quản trị hiện tại</span>
                  <span className="font-semibold text-gray-900">
                    {currentUser?.fullName || 'Trần H. Nam'} ({currentUser?.email || 'admin@luxestore.vn'})
                  </span>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-xs space-y-1">
                  <span className="text-gray-500 block">Phiên bản giao diện</span>
                  <span className="font-bold text-[#8A5B36]">
                    LUXE Admin v2.6 (Design Matching Figma)
                  </span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    dispatch(demoLoginApi('admin'));
                    dispatch(showToast({ message: 'Đã thiết lập lại quyền Admin!', type: 'success' }));
                  }}
                  className="px-5 py-2.5 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  Xác Thực Lại Phiên Admin
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
