import React, { useState } from 'react';
import {
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  FileText,
  X,
  Phone,
  MapPin,
  Printer
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrders } from '../../redux/order/orderSlice';
import { updateOrderStatusApi } from '../../redux/order/orderApi';
import { showToast } from '../../redux/ui/uiSlice';
import InvoiceModal from '../../components/InvoiceModal';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const AdminOrdersView = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);

  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Status mapping
  const statusTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'processing', label: 'Chờ xác nhận' },
    { id: 'shipping', label: 'Đang giao' },
    { id: 'delivered', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' }
  ];

  const getStatusCount = (statusId) => {
    if (statusId === 'all') return orders.length;
    return orders.filter(
      (o) =>
        o.statusCode === statusId ||
        (statusId === 'processing' && o.status === 'Chờ xác nhận') ||
        (statusId === 'shipping' && o.status === 'Đang giao') ||
        (statusId === 'delivered' && o.status === 'Hoàn thành') ||
        (statusId === 'cancelled' && o.status === 'Đã hủy')
    ).length;
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    const matchCode = (o.orderCode || o.id || o._id || '').toLowerCase().includes(q);
    const matchCust = (o.customerInfo?.fullName || '').toLowerCase().includes(q);
    const matchPhone = (o.customerInfo?.phone || '').toLowerCase().includes(q);

    if (activeStatusTab === 'all') return matchCode || matchCust || matchPhone;
    const matchStatus =
      o.statusCode === activeStatusTab ||
      (activeStatusTab === 'processing' && o.status === 'Chờ xác nhận') ||
      (activeStatusTab === 'shipping' && o.status === 'Đang giao') ||
      (activeStatusTab === 'delivered' && o.status === 'Hoàn thành') ||
      (activeStatusTab === 'cancelled' && o.status === 'Đã hủy');

    return (matchCode || matchCust || matchPhone) && matchStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    let statusCode = 'processing';
    if (newStatus === 'Đang giao') statusCode = 'shipping';
    if (newStatus === 'Hoàn thành') statusCode = 'delivered';
    if (newStatus === 'Đã hủy') statusCode = 'cancelled';

    const res = await dispatch(updateOrderStatusApi({ id: orderId, status: newStatus, statusCode }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ message: `Đã đổi trạng thái đơn hàng sang "${newStatus}"`, type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Lỗi cập nhật trạng thái đơn hàng', type: 'error' }));
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Hoàn thành') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (status === 'Đang giao') return 'bg-amber-50 text-amber-800 border-amber-200';
    if (status === 'Đã hủy') return 'bg-rose-50 text-rose-800 border-rose-200';
    return 'bg-orange-50 text-orange-800 border-orange-200';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => {
            const count = getStatusCount(tab.id);
            const isActive = activeStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatusTab(tab.id)}
                className={`px-3 py-1.5 text-xs rounded-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#8A5B36] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo mã đơn, khách, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 pl-8 pr-3 py-2 text-xs border border-gray-300 bg-white rounded-xs focus:outline-hidden focus:border-black"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>

          <button
            onClick={() => dispatch(showToast({ message: 'Đang xuất danh sách đơn hàng ra file Excel...', type: 'info' }))}
            className="px-3.5 py-2 border border-gray-300 hover:border-black bg-white text-gray-700 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAF8F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">MÃ ĐƠN HÀNG</th>
                <th className="py-3.5 px-4">KHÁCH HÀNG</th>
                <th className="py-3.5 px-4">NGÀY ĐẶT</th>
                <th className="py-3.5 px-4">PHƯƠNG THỨC</th>
                <th className="py-3.5 px-4 text-right">TỔNG TIỀN</th>
                <th className="py-3.5 px-4 text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const oId = order._id || order.id || order.orderCode;
                  const currentStatus = order.status || 'Chờ xác nhận';

                  return (
                    <tr key={oId} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {order.orderCode || oId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900">
                          {order.customerInfo?.fullName || 'Khách hàng'}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {order.customerInfo?.phone || 'Chưa cập nhật'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                          : '18/10/2026'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {order.paymentMethod || 'Chuyển khoản VietQR'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(oId, e.target.value)}
                          className={`text-xs py-1 px-2.5 border rounded-xs font-semibold cursor-pointer ${getStatusBadge(
                            currentStatus
                          )}`}
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-2.5 py-1 text-xs text-[#8A5B36] hover:bg-[#FAF5EE] border border-[#E8DFD0] rounded-xs font-semibold transition-colors cursor-pointer"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="px-2.5 py-1 text-xs bg-[#FAF5EE] hover:bg-[#8A5B36] text-[#8A5B36] hover:text-white border border-[#E8DFD0] rounded-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="In / Xuất hóa đơn bán lẻ quà tặng"
                          >
                            <Printer size={12} />
                            <span>Hóa đơn</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedOrderDetails(null)}
          />
          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 rounded-xs animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5B36]">
                  CHI TIẾT ĐƠN HÀNG
                </span>
                <h3 className="text-base font-bold text-gray-900 font-mono mt-0.5">
                  {selectedOrderDetails.orderCode || selectedOrderDetails.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Information */}
            <div className="bg-[#FAF8F5] p-3.5 border border-gray-200 text-xs space-y-1.5 rounded-xs">
              <p>
                <strong>Khách hàng:</strong> {selectedOrderDetails.customerInfo?.fullName}
              </p>
              <p>
                <strong>Điện thoại:</strong> {selectedOrderDetails.customerInfo?.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedOrderDetails.customerInfo?.address},{' '}
                {selectedOrderDetails.customerInfo?.district},{' '}
                {selectedOrderDetails.customerInfo?.province}
              </p>
              <p>
                <strong>Phương thức:</strong> {selectedOrderDetails.paymentMethod}
              </p>
              {selectedOrderDetails.customerInfo?.note && (
                <p>
                  <strong>Ghi chú:</strong> {selectedOrderDetails.customerInfo.note}
                </p>
              )}
            </div>

            {/* Items list */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700 mb-2">
                Sản phẩm trong đơn ({selectedOrderDetails.items?.length || 0})
              </h4>
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                {(selectedOrderDetails.items || []).map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80&q=80'}
                        alt={item.name}
                        className="w-9 h-11 object-cover rounded-xs border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="pt-3 border-t border-gray-100 text-xs space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatCurrency(selectedOrderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>
                  {selectedOrderDetails.shippingFee === 0
                    ? 'Miễn phí'
                    : formatCurrency(selectedOrderDetails.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200">
                <span>Tổng cộng:</span>
                <span className="text-red-600 font-extrabold">
                  {formatCurrency(selectedOrderDetails.total)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setInvoiceOrder(selectedOrderDetails)}
                className="flex-1 py-2.5 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer size={14} />
                <span>In Hóa Đơn Bán Lẻ</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="py-2.5 px-6 border border-gray-300 text-gray-700 hover:border-black text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal (In & Xuất Hóa Đơn) */}
      <InvoiceModal
        isOpen={Boolean(invoiceOrder)}
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
};

export default AdminOrdersView;
