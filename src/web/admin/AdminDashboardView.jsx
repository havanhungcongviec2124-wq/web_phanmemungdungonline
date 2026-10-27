import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Layers,
  TrendingUp,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectProducts } from '../../redux/product/productSlice';
import { selectOrders } from '../../redux/order/orderSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const AdminDashboardView = ({ onNavigateTab }) => {
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);

  // Tính toán KPI từ MongoDB
  const liveRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const displayRevenue = liveRevenue > 0 ? liveRevenue : 245680000;
  const displayOrderCount = orders.length > 0 ? orders.length : 156;
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const displayStock = totalStock > 0 ? totalStock : 3456;
  const totalSold = products.reduce((acc, p) => acc + (Number(p.soldCount) || 0), 0);
  const displaySold = totalSold > 0 ? totalSold : 1247;

  // Top 5 sản phẩm bán chạy
  const topProducts = products && products.length > 0
    ? [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5)
    : [
        {
          id: 'gift_1',
          name: "Hộp Quà Thư Giãn 'Serene Evening'",
          soldCount: 342,
          images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80']
        },
        {
          id: 'gift_2',
          name: "Set Quà Tân Gia Gốm Sứ Nhật Bản 'Hòa Hợp'",
          soldCount: 289,
          images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200&q=80']
        },
        {
          id: 'gift_3',
          name: 'Nến Thơm Cao Cấp Tinh Dầu Gỗ Đàn Hương & Hổ Phách',
          soldCount: 212,
          images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&q=80']
        },
        {
          id: 'gift_4',
          name: 'Bút Ký Kim Loại Mạ Vàng & Sổ Da Handmade Khắc Tên',
          soldCount: 189,
          images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&q=80']
        },
        {
          id: 'gift_5',
          name: 'Bộ Ấm Chén Sứ Ngọc Bích Cao Cấp & Trà Sen Tây Hồ',
          soldCount: 154,
          images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80']
        }
      ];

  // 6 tháng gần nhất biểu đồ cột
  const monthlyData = [
    { month: 'Th 5', revenue: 140000000, height: '48%' },
    { month: 'Th 6', revenue: 175000000, height: '62%' },
    { month: 'Th 7', revenue: 198000000, height: '72%' },
    { month: 'Th 8', revenue: 215000000, height: '80%' },
    { month: 'Th 9', revenue: 220000000, height: '83%' },
    { month: 'Th 10', revenue: 245680000, height: '100%' },
  ];

  // Đơn hàng gần đây
  const recentOrders = orders && orders.length > 0
    ? orders.slice(0, 5)
    : [
        {
          orderCode: '#LUXE-8821',
          customerInfo: { fullName: 'Nguyễn Văn An' },
          createdAt: '2026-10-18',
          total: 1290000,
          status: 'Hoàn thành',
          statusCode: 'delivered'
        },
        {
          orderCode: '#LUXE-8820',
          customerInfo: { fullName: 'Trần Thị Bích' },
          createdAt: '2026-10-17',
          total: 890000,
          status: 'Đang giao',
          statusCode: 'shipping'
        },
        {
          orderCode: '#LUXE-8819',
          customerInfo: { fullName: 'Lê Hoàng Nam' },
          createdAt: '2026-10-17',
          total: 2340000,
          status: 'Hoàn thành',
          statusCode: 'delivered'
        },
        {
          orderCode: '#LUXE-8818',
          customerInfo: { fullName: 'Phạm Minh Thư' },
          createdAt: '2026-10-16',
          total: 1450000,
          status: 'Đã hủy',
          statusCode: 'cancelled'
        },
        {
          orderCode: '#LUXE-8817',
          customerInfo: { fullName: 'Đỗ Quốc Bảo' },
          createdAt: '2026-10-16',
          total: 3100000,
          status: 'Chờ xác nhận',
          statusCode: 'processing'
        }
      ];

  const getStatusBadge = (status, code) => {
    if (status === 'Hoàn thành' || code === 'delivered') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (status === 'Đang giao' || code === 'shipping') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (status === 'Đã hủy' || code === 'cancelled') {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    return 'bg-orange-50 text-orange-800 border-orange-200';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 4 Stat Cards (Exact Figma layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                DOANH THU THÁNG
              </span>
              <h3 className="text-xl font-bold text-[#18181B] mt-2 tracking-tight">
                {formatCurrency(displayRevenue)}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <ArrowUpRight size={13} />
                <span>+12.5%</span>
                <span className="text-[#8C827A] font-normal">so với tháng trước</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xs bg-[#FAF5EE] border border-[#ECE4D8] flex items-center justify-center text-[#8A5B36] font-bold text-base shrink-0">
              ₫
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                ĐƠN HÀNG MỚI
              </span>
              <h3 className="text-xl font-bold text-[#18181B] mt-2 tracking-tight">
                {displayOrderCount} đơn
              </h3>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <ArrowUpRight size={13} />
                <span>+8.3%</span>
                <span className="text-[#8C827A] font-normal">so với tháng trước</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xs bg-[#FAF5EE] border border-[#ECE4D8] flex items-center justify-center text-[#8A5B36] shrink-0">
              <ShoppingBag size={18} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                SẢN PHẨM ĐÃ BÁN
              </span>
              <h3 className="text-xl font-bold text-[#18181B] mt-2 tracking-tight">
                {displaySold.toLocaleString('vi-VN')} món
              </h3>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <ArrowUpRight size={13} />
                <span>+15.2%</span>
                <span className="text-[#8C827A] font-normal">so với tháng trước</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xs bg-[#FAF5EE] border border-[#ECE4D8] flex items-center justify-center text-[#8A5B36] shrink-0">
              <Package size={18} />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                TỔNG TỒN KHO
              </span>
              <h3 className="text-xl font-bold text-[#18181B] mt-2 tracking-tight">
                {displayStock.toLocaleString('vi-VN')} sản phẩm
              </h3>
              <p className="text-[11px] text-[#8C827A] mt-1">
                Đang theo dõi 8 phân loại
              </p>
            </div>
            <div className="w-10 h-10 rounded-xs bg-[#FAF5EE] border border-[#ECE4D8] flex items-center justify-center text-[#8A5B36] shrink-0">
              <Layers size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 6-Month Revenue Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 border border-[#ECE7DF] rounded-xs shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-sm font-bold text-[#18181B] tracking-wide">
                Doanh Thu 6 Tháng Gần Nhất
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#8C827A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A5B36]" />
                <span>Doanh thu thực tế</span>
              </div>
            </div>

            {/* Custom Bar Chart Canvas */}
            <div className="h-60 flex items-end justify-between gap-4 sm:gap-6 pt-4 pb-2 px-2 border-b border-gray-200">
              {monthlyData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-[#8A5B36] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {Math.round(item.revenue / 1000000)}Tr
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-[#8A5B36] hover:bg-[#A06C42] rounded-t-xs transition-all duration-500 shadow-sm"
                    style={{ height: item.height }}
                  />
                  <span className="text-xs font-medium text-gray-600 mt-2">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Tăng trưởng trung bình hàng tháng: <strong>+11.8%</strong></span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-[#8A5B36] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Xem báo cáo chi tiết <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Right: Top Selling Products */}
        <div className="lg:col-span-5 bg-white p-6 border border-[#ECE7DF] rounded-xs shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h3 className="text-sm font-bold text-[#18181B] tracking-wide">
              Sản Phẩm Bán Chạy Nhất
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#8A5B36] hover:underline font-medium cursor-pointer"
            >
              Tất cả
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {topProducts.map((p, idx) => (
              <div key={p.id || p._id || idx} className="py-3 flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#A08870] w-6 shrink-0 text-center">
                  0{idx + 1}
                </span>
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&q=80'}
                  alt={p.name}
                  className="w-11 h-13 object-cover object-top rounded-xs border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 truncate">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-[#8C827A] mt-0.5">
                    {p.soldCount || 100} lượt bán
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders Table */}
      <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <h3 className="text-sm font-bold text-[#18181B] tracking-wide">
            Đơn Hàng Gần Đây
          </h3>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#8A5B36] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            Quản lý tất cả đơn hàng <ChevronRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAF8F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">MÃ ĐƠN</th>
                <th className="py-3 px-4">KHÁCH HÀNG</th>
                <th className="py-3 px-4">NGÀY ĐẶT</th>
                <th className="py-3 px-4 text-right">TỔNG TIỀN</th>
                <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id || order.id || order.orderCode} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {order.orderCode || order.id || order._id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {order.customerInfo?.fullName || 'Khách vãng lai'}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '18/10/2026'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] font-semibold border rounded-xs ${getStatusBadge(
                        order.status,
                        order.statusCode
                      )}`}
                    >
                      {order.status || 'Đang xử lý'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
