import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrders } from '../../redux/order/orderSlice';
import { showToast } from '../../redux/ui/uiSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const AdminReportsView = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Daily revenue data for October
  const dailyData = [
    { day: '01', rev: 8200000, height: '35%' },
    { day: '03', rev: 9500000, height: '40%' },
    { day: '05', rev: 11200000, height: '48%' },
    { day: '07', rev: 10800000, height: '46%' },
    { day: '09', rev: 13500000, height: '58%' },
    { day: '11', rev: 15200000, height: '65%' },
    { day: '13', rev: 16800000, height: '72%' },
    { day: '15', rev: 18400000, height: '80%' },
    { day: '17', rev: 21500000, height: '92%' },
    { day: '18', rev: 24500000, height: '100%' },
  ];

  // Category shares
  const categoryShare = [
    { name: 'Áo Blazer & Khoác', percent: 40, amount: 98272000, color: '#8A5B36' },
    { name: 'Đầm Lụa Thiết Kế', percent: 25, amount: 61420000, color: '#A06C42' },
    { name: 'Túi Da & Phụ Kiện', percent: 20, amount: 49136000, color: '#C49770' },
    { name: 'Quần & Chân Váy', percent: 10, amount: 24568000, color: '#D9B99B' },
    { name: 'Khác', percent: 5, amount: 12284000, color: '#EBE2D5' },
  ];

  // Payment channel shares
  const paymentShare = [
    { method: 'Chuyển khoản VietQR', percent: 62, count: 97, amount: 152321600 },
    { method: 'Thanh toán COD', percent: 28, count: 44, amount: 68790400 },
    { method: 'Thẻ Visa / MasterCard', percent: 10, count: 15, amount: 24568000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#8A5B36]" />
          <span className="text-xs font-semibold text-gray-700">Kỳ báo cáo:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs border border-gray-300 rounded-xs py-1.5 px-3 bg-[#FAF8F5] focus:outline-hidden font-medium cursor-pointer"
          >
            <option value="month">Tháng này (10/2026)</option>
            <option value="last_month">Tháng trước (09/2026)</option>
            <option value="quarter">Quý 4 / 2026</option>
            <option value="year">Cả năm 2026</option>
          </select>
        </div>

        <button
          onClick={() =>
            dispatch(showToast({ message: 'Đang tải xuống báo cáo doanh thu PDF...', type: 'info' }))
          }
          className="px-4 py-2 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Download size={14} />
          <span>Xuất File Báo Cáo</span>
        </button>
      </div>

      {/* Main Revenue Chart (Matching Figma admin-reports) */}
      <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wide">
              Biểu Đồ Doanh Thu Theo Ngày (Tháng 10/2026)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tần suất bán hàng tăng mạnh vào các đợt phát hành bộ sưu tập mới
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Tổng doanh thu kỳ:</span>
            <div className="text-xl font-extrabold text-[#18181B]">245.680.000đ</div>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-4 pb-2 px-2 border-b border-gray-200">
          {dailyData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-mono font-bold text-[#8A5B36] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                {Math.round(item.rev / 1000000)}Tr
              </span>
              <div
                className="w-full max-w-[36px] bg-[#8A5B36] hover:bg-[#A06C42] rounded-t-xs transition-all duration-500 shadow-sm"
                style={{ height: item.height }}
              />
              <span className="text-xs font-medium text-gray-600 mt-2">
                N{item.day}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-[#FAF8F5] border border-gray-100 rounded-xs">
            <span className="text-[11px] text-gray-500 block">Doanh thu trung bình / ngày</span>
            <span className="text-sm font-bold text-gray-900 mt-1 block">13.650.000đ</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] border border-gray-100 rounded-xs">
            <span className="text-[11px] text-gray-500 block">Ngày doanh số cao nhất</span>
            <span className="text-sm font-bold text-[#8A5B36] mt-1 block">18/10 (24.500.000đ)</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] border border-gray-100 rounded-xs">
            <span className="text-[11px] text-gray-500 block">Tỷ lệ tăng trưởng so với T9</span>
            <span className="text-sm font-bold text-emerald-700 mt-1 block">+18.4%</span>
          </div>
        </div>
      </div>

      {/* Two Breakdown Sections: Category Share & Payment Method Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Contribution */}
        <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 tracking-wide">
              Top Danh Mục Đóng Góp Doanh Thu
            </h3>
            <span className="text-xs text-gray-500">100% tỷ trọng</span>
          </div>

          <div className="space-y-4">
            {categoryShare.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-800">{cat.name}</span>
                  <span className="text-gray-900 font-bold">
                    {formatCurrency(cat.amount)} ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels */}
        <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 tracking-wide">
              Hiệu Quả Kênh Bán & Thanh Toán
            </h3>
            <span className="text-xs text-gray-500">156 đơn hàng</span>
          </div>

          <div className="space-y-4">
            {paymentShare.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAF8F5] border border-gray-200 rounded-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-900">{item.method}</span>
                  <span className="font-bold text-[#8A5B36]">{item.percent}%</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>Số lượng: {item.count} đơn</span>
                  <span>Tổng tiền: {formatCurrency(item.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsView;
