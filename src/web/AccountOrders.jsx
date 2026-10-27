import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, User, LogOut, CheckCircle2, Clock, Truck, ChevronRight, ShieldCheck, Printer } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrders } from '../redux/order/orderSlice';
import { fetchOrdersApi } from '../redux/order/orderApi';
import { selectWishlist } from '../redux/cart/cartSlice';
import { selectProducts } from '../redux/product/productSlice';
import { fetchProductsApi } from '../redux/product/productApi';
import { selectCurrentUser, logout } from '../redux/Auth/authSlice';
import { showToast } from '../redux/ui/uiSlice';
import { formatCurrency } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import InvoiceModal from '../components/InvoiceModal';

const AccountOrders = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const orders = useSelector(selectOrders);
  const wishlist = useSelector(selectWishlist);
  const products = useSelector(selectProducts);
  const currentUser = useSelector(selectCurrentUser);

  React.useEffect(() => {
    if (currentUser) {
      dispatch(fetchOrdersApi());
      if (products.length === 0) dispatch(fetchProductsApi());
    }
  }, [dispatch, currentUser, products.length]);

  // Wishlist products từ live products
  const wishlistedProducts = products.filter((p) => wishlist.includes(String(p._id || p.id)));

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'Đã đăng xuất tài khoản', type: 'info' }));
    navigate('/auth');
  };

  const userInitials = currentUser?.fullName
    ? currentUser.fullName.split(' ').filter(Boolean).map(n => n[0]).slice(-2).join('').toUpperCase()
    : 'LU';

  if (!currentUser) {
    return (
      <div className="bg-[#FAF9F6] min-h-[75vh] py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[#ECE7DF] p-8 sm:p-10 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF5EE] border border-[#E8DFD0] flex items-center justify-center mx-auto text-[#8A5B36]">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-serif text-gray-900 font-semibold mb-2">
              Yêu Cầu Đăng Nhập
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Vui lòng đăng nhập vào tài khoản của bạn để xem thông tin tài khoản, lịch sử đơn hàng và danh sách yêu thích.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              to="/auth"
              className="block w-full py-3.5 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Đăng Nhập / Đăng Ký
            </Link>
            <Link
              to="/home"
              className="block w-full py-3 border border-gray-300 hover:border-black text-gray-700 text-xs uppercase tracking-wider font-medium transition-colors"
            >
              Quay Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12 text-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-black">Trang chủ</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">Tài khoản & Đơn hàng</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 4 Cols: Profile Summary Card & Nav */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#ECE7DF] p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#18181B] text-white text-2xl font-serif flex items-center justify-center mx-auto border-4 border-[#F5F2EB]">
                {userInitials}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{currentUser.fullName}</h2>
                <span className="inline-block mt-1 text-[11px] font-semibold text-[#8A5B36] bg-[#FAF5EE] px-2.5 py-0.5 border border-[#E8DFD0]">
                  {currentUser.role === 'admin' ? 'QUẢN TRỊ VIÊN HỆ THỐNG' : (currentUser.membership || 'HỘI VIÊN LUXE GOLD')}
                </span>
                <p className="text-xs text-gray-500 mt-2">{currentUser.email}</p>
                <p className="text-xs text-gray-500">{currentUser.phone || 'Chưa cập nhật số điện thoại'}</p>

                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-block mt-3 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold hover:bg-amber-200 transition-colors"
                  >
                    Vào Bảng Quản Trị Hệ Thống →
                  </Link>
                )}
              </div>
            </div>

            {/* Menu items */}
            <div className="bg-white border border-[#ECE7DF] divide-y divide-gray-100 text-xs font-medium">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                  activeTab === 'orders' ? 'bg-[#FAF8F5] text-[#8A5B36] font-bold border-l-4 border-[#8A5B36]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Package size={16} /> Lịch Sử Đơn Hàng
                </span>
                <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-normal">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                  activeTab === 'wishlist' ? 'bg-[#FAF8F5] text-[#8A5B36] font-bold border-l-4 border-[#8A5B36]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Heart size={16} /> Danh Sách Yêu Thích
                </span>
                <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-normal">
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                  activeTab === 'addresses' ? 'bg-[#FAF8F5] text-[#8A5B36] font-bold border-l-4 border-[#8A5B36]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin size={16} /> Sổ Địa Chỉ Giao Hàng
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center gap-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Đăng Xuất
              </button>
            </div>
          </div>

          {/* Right 8 Cols: Tab Content */}
          <div className="lg:col-span-8">
            {/* 1. Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#ECE7DF]">
                  <h3 className="text-xl font-serif text-gray-900">Đơn Hàng Gần Đây</h3>
                  <span className="text-xs text-gray-500">{orders.length} đơn hàng</span>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white p-12 text-center border border-[#ECE7DF] space-y-3">
                    <Package size={40} className="mx-auto text-gray-300" />
                    <p className="text-xs text-gray-500">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products" className="inline-block px-5 py-2 bg-black text-white text-xs uppercase font-medium">
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id || order.id || order.orderCode} className="bg-white border border-[#ECE7DF] p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-900 font-mono">
                              {order.orderCode || order.id || order._id}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              • {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : (order.date || 'Hôm nay')}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs inline-flex items-center gap-1.5 ${
                              order.statusCode === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800'
                                : order.statusCode === 'shipping'
                                ? 'bg-sky-50 text-sky-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {order.statusCode === 'delivered' ? (
                              <CheckCircle2 size={13} />
                            ) : order.statusCode === 'shipping' ? (
                              <Truck size={13} />
                            ) : (
                              <Clock size={13} />
                            )}
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-gray-100">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="py-3 flex gap-3 items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-14 object-cover object-top rounded-xs bg-[#FAF8F5] border border-gray-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-medium text-gray-900 truncate">{item.name}</h4>
                                <p className="text-[11px] text-gray-500">
                                  {item.color} | {item.size} × {item.quantity}
                                </p>
                              </div>
                              <span className="text-xs font-semibold text-gray-900">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center gap-4 text-[11px] text-gray-500">
                            <span>Phương thức: <strong>{order.paymentMethod}</strong></span>
                            <button
                              onClick={() => setInvoiceOrder(order)}
                              className="text-[#8A5B36] hover:text-black font-semibold flex items-center gap-1 cursor-pointer underline"
                            >
                              <Printer size={12} />
                              In Hóa Đơn
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Tổng thanh toán:</span>
                            <span className="text-base font-bold text-[#18181B]">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#ECE7DF]">
                  <h3 className="text-xl font-serif text-gray-900">Sản Phẩm Yêu Thích</h3>
                  <span className="text-xs text-gray-500">{wishlistedProducts.length} sản phẩm</span>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="bg-white p-12 text-center border border-[#ECE7DF] space-y-3">
                    <Heart size={40} className="mx-auto text-gray-300" />
                    <p className="text-xs text-gray-500">Bạn chưa lưu sản phẩm yêu thích nào.</p>
                    <Link to="/products" className="inline-block px-5 py-2 bg-black text-white text-xs uppercase font-medium">
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistedProducts.map((product) => (
                      <ProductCard key={product._id || product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#ECE7DF]">
                  <h3 className="text-xl font-serif text-gray-900">Sổ Địa Chỉ Nhận Hàng</h3>
                  <button
                    onClick={() => showToast('Chức năng thêm địa chỉ đang cập nhật')}
                    className="text-xs font-semibold text-[#8A5B36] hover:underline"
                  >
                    + Thêm địa chỉ mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser?.address && (currentUser.address.detail || currentUser.address.province) ? (
                    <div className="bg-white border-2 border-[#18181B] p-5 space-y-2 relative">
                      <span className="absolute top-4 right-4 text-[10px] bg-[#18181B] text-white px-2 py-0.5 uppercase font-bold">
                        Mặc định
                      </span>
                      <h4 className="text-xs font-bold text-gray-900">{currentUser.fullName}</h4>
                      <p className="text-xs text-gray-600">{currentUser.phone || 'Chưa có số điện thoại'}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {[currentUser.address.detail, currentUser.address.ward, currentUser.address.district, currentUser.address.province].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div className="col-span-full bg-white border border-dashed border-gray-300 p-8 text-center text-xs text-gray-500">
                      Chưa có địa chỉ giao hàng nào được lưu. Bạn có thể cập nhật thông tin trong tài khoản.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(invoiceOrder)}
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
};

export default AccountOrders;
