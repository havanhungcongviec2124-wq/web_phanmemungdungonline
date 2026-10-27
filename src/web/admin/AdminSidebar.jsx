import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, logout } from '../../redux/Auth/authSlice';
import { showToast } from '../../redux/ui/uiSlice';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
    { id: 'inventory', label: 'Kho hàng', icon: Layers },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'Đã đăng xuất tài khoản quản trị', type: 'info' }));
  };

  return (
    <aside className="w-64 bg-[#111111] text-[#A1A1AA] flex flex-col shrink-0 min-h-screen border-r border-[#222222] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#222222]">
        <Link to="/admin" className="block">
          <span className="text-xl font-bold tracking-[0.2em] text-white font-serif uppercase block">
            LUXE<span className="font-light text-[#D4AF37] ml-1">STORE</span>
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#8C827A] font-sans uppercase font-medium block mt-1">
            ADMIN PORTAL
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-medium rounded-xs transition-all duration-200 text-left cursor-pointer ${
                isActive
                  ? 'bg-[#222224] text-white font-semibold shadow-xs border-l-3 border-[#8A5B36]'
                  : 'text-[#909099] hover:bg-[#1A1A1C] hover:text-[#ECECEC]'
              }`}
            >
              <Icon
                size={16}
                className={isActive ? 'text-[#C9A87C]' : 'text-[#71717A]'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6 mt-6 border-t border-[#222222]">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#71717A] hover:text-white hover:bg-[#1A1A1C] rounded-xs transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Về website bán hàng</span>
          </Link>
        </div>
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-[#222222] bg-[#141416] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#27272A] border border-[#3F3F46] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {currentUser?.fullName
              ? currentUser.fullName.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
              : 'TH'}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">
              {currentUser?.fullName || 'Trần H. Nam'}
            </h4>
            <p className="text-[10px] text-[#A08870] uppercase tracking-wider">
              {currentUser?.role === 'admin' ? 'Quản trị viên' : 'Quản trị viên'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Đăng xuất"
          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#222224] rounded-xs transition-colors cursor-pointer"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
