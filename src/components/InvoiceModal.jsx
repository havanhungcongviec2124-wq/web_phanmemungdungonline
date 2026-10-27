import React from 'react';
import { Printer, Download, X, Gift, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { formatCurrency } from '../data/mockData';

const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = order.orderCode || order.id || `HD-${Date.now().toString().slice(-6)}`;
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });

  const items = order.items || [];
  const subtotal = order.subtotal || order.total || 0;
  const shippingFee = order.shippingFee || 0;
  const total = order.total || subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in print:p-0 print:m-0 print:static">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs print:hidden"
        onClick={onClose}
      />

      {/* Invoice Container */}
      <div className="relative bg-white border border-gray-300 max-w-2xl w-full p-6 sm:p-10 rounded-xs shadow-2xl z-10 space-y-6 print:shadow-none print:border-none print:max-w-none print:p-8">
        {/* Action Bar (hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xs">
            <CheckCircle2 size={14} />
            Hóa Đơn Bán Lẻ Quà Tặng Hợp Lệ
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer size={14} />
              <span>In Hóa Đơn</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xs"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTENT */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-300">
            <div>
              <div className="text-2xl font-serif font-extrabold tracking-widest text-[#18181B] uppercase">
                LUXE<span className="font-light text-[#8A5B36] ml-1">GIFTS</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-serif italic">
                Nghệ Thuật Tặng Quà & Combo Tinh Tế
              </p>
              <div className="text-[11px] text-gray-600 space-y-0.5 mt-2">
                <p>Địa chỉ: 128 Phố Huế, Q. Hai Bà Trưng, Hà Nội</p>
                <p>Hotline: 1900 6868 • Website: www.luxegifts.vn</p>
                <p>Email: cskh@luxegifts.vn</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-lg font-bold uppercase tracking-wider text-gray-900 block font-serif">
                HÓA ĐƠN BÁN HÀNG
              </span>
              <p className="text-xs font-mono font-bold text-[#8A5B36] mt-1">
                Số: {invoiceNumber}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Ngày: {orderDate}
              </p>
              <div className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-[10px] font-semibold text-gray-700 uppercase rounded-xs">
                Hình thức: {order.paymentMethod || 'Chuyển khoản VietQR'}
              </div>
            </div>
          </div>

          {/* Customer & Gift Message Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-gray-200 rounded-xs text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                KHÁCH HÀNG / NGƯỜI ĐẶT:
              </span>
              <p className="font-bold text-gray-900 text-sm">
                {order.customerInfo?.fullName || 'Khách vãng lai'}
              </p>
              <p className="text-gray-600">
                SĐT: {order.customerInfo?.phone || 'Chưa cung cấp'}
              </p>
              <p className="text-gray-600">
                Địa chỉ: {order.customerInfo?.address ? `${order.customerInfo.address}, ${order.customerInfo.district || ''}, ${order.customerInfo.province || ''}` : 'Nhận tại cửa hàng'}
              </p>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-4 pt-2 sm:pt-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                <Gift size={12} className="text-[#8A5B36]" /> THÔNG ĐIỆP THIỆP MỪNG KÈM THEO:
              </span>
              <div className="p-2.5 bg-white border border-dashed border-[#D4AF37] rounded-xs text-gray-800 italic text-[11px] min-h-[50px]">
                "{order.customerInfo?.giftMessage || order.customerInfo?.note || 'Chúc bạn luôn ngập tràn niềm vui, bình an và hạnh phúc trong cuộc sống!'}"
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  <th className="py-2.5 px-2 w-8 text-center">#</th>
                  <th className="py-2.5 px-2">TÊN MÓN QUÀ / COMBO</th>
                  <th className="py-2.5 px-2 text-center">LOẠI</th>
                  <th className="py-2.5 px-2 text-center">SL</th>
                  <th className="py-2.5 px-2 text-right">ĐƠN GIÁ</th>
                  <th className="py-2.5 px-2 text-right">THÀNH TIỀN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      Không có chi tiết sản phẩm.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2.5 px-2 text-center font-mono text-gray-500">{idx + 1}</td>
                      <td className="py-2.5 px-2">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        {item.color && item.color !== 'Tiêu chuẩn' && (
                          <div className="text-[10px] text-gray-500">Màu/Ghi chú: {item.color}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-xs font-bold uppercase ${
                          item.giftType === 'combo' ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.giftType === 'combo' ? 'Combo' : 'Quà Lẻ'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-semibold text-gray-800">{item.quantity}</td>
                      <td className="py-2.5 px-2 text-right text-gray-600">{formatCurrency(item.price)}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-3 border-t-2 border-gray-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Tiền hàng (Tạm tính):</span>
              <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Dịch vụ đóng hộp quà & thiệp chúc mừng:</span>
              <span className="font-semibold text-emerald-700">Miễn phí (Tặng kèm)</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển giao quà tận nơi:</span>
              <span className="font-medium text-gray-900">
                {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-300 text-sm">
              <span className="font-bold text-gray-900 uppercase">TỔNG CỘNG THANH TOÁN:</span>
              <span className="text-base font-extrabold text-[#8A5B36] font-mono">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Signatures & Footer Note */}
          <div className="grid grid-cols-2 pt-6 text-center text-xs text-gray-600 border-t border-dashed border-gray-300">
            <div>
              <p className="font-bold text-gray-800">Người Mua / Người Gửi</p>
              <p className="text-[10px] text-gray-400 italic mt-0.5">(Ký, ghi rõ họ tên)</p>
              <div className="h-14" />
              <p className="font-medium text-gray-700">{order.customerInfo?.fullName || 'Khách hàng'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Đại Diện Cửa Hàng LUXE GIFTS</p>
              <p className="text-[10px] text-gray-400 italic mt-0.5">(Đã xác nhận & kiểm tra quà)</p>
              <div className="h-14 flex items-center justify-center">
                <span className="inline-block px-3 py-1 border-2 border-red-500 text-red-600 font-bold text-[11px] uppercase -rotate-6">
                  ĐÃ XUẤT QUÀ
                </span>
              </div>
              <p className="font-medium text-gray-700">Bộ phận Gói Quà Thủ Công</p>
            </div>
          </div>

          <div className="text-center text-[11px] text-gray-400 pt-3 border-t border-gray-200">
            Cảm ơn quý khách đã tin tưởng lựa chọn quà tặng tại LUXE GIFTS. Chúc quý khách và người nhận luôn an vui, thịnh vượng!
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
