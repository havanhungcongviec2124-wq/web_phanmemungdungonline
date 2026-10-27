import React from 'react';
import { Search, Bell, Calendar, Plus, RefreshCw, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { fetchProductsApi } from '../../redux/product/productApi';
import { fetchOrdersApi } from '../../redux/order/orderApi';
import { showToast } from '../../redux/ui/uiSlice';

const AdminHeader = ({ title, subtitle, onActionClick, actionLabel, actionIcon: ActionIcon }) => {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(fetchProductsApi());
    dispatch(fetchOrdersApi());
    dispatch(showToast({ message: 'Đã làm mới dữ liệu từ MongoDB Atlas', type: 'info' }));
  };

  return (
    <header className="bg-white border-b border-[#ECE7DF] px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
      <div>
        <h1 className="text-2xl font-serif text-[#18181B] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#8C827A] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Global Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm hệ thống..."
            className="w-48 sm:w-60 bg-[#FAF7F2] border border-[#E2DDD3] text-xs text-[#18181B] placeholder-gray-400 pl-8 pr-3 py-2 rounded-xs focus:outline-hidden focus:border-[#8A5B36] transition-colors"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          title="Làm mới dữ liệu từ MongoDB"
          className="p-2 border border-[#E2DDD3] bg-white hover:bg-[#FAF7F2] text-gray-600 rounded-xs transition-colors cursor-pointer"
        >
          <RefreshCw size={15} />
        </button>

        {/* Notification Bell */}
        <button
          title="Thông báo"
          className="relative p-2 border border-[#E2DDD3] bg-white hover:bg-[#FAF7F2] text-gray-600 rounded-xs transition-colors cursor-pointer"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#8A5B36] rounded-full" />
        </button>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-[#FAF7F2] border border-[#E2DDD3] text-xs font-medium text-gray-700 rounded-xs">
          <Calendar size={13} className="text-[#8A5B36]" />
          <span>18 Tháng 10, 2026</span>
        </div>

        {/* Custom Action Button (e.g. + Thêm sản phẩm) */}
        {actionLabel && (
          <button
            onClick={onActionClick}
            className="px-4 py-2 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {ActionIcon && <ActionIcon size={14} />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
