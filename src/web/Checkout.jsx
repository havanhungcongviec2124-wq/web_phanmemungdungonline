import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectSubtotal,
  selectShippingFee,
  selectDiscountAmount,
  selectTotal,
  clearCart,
} from '../redux/cart/cartSlice';
import { selectAppliedVoucher, removeVoucher } from '../redux/voucher/voucherSlice';
import { selectCurrentUser } from '../redux/Auth/authSlice';
import { createOrderApi } from '../redux/order/orderApi';
import { showToast } from '../redux/ui/uiSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const shippingFee = useSelector(selectShippingFee);
  const discountAmount = useSelector(selectDiscountAmount);
  const total = useSelector(selectTotal);
  const appliedVoucher = useSelector(selectAppliedVoucher);
  const currentUser = useSelector(selectCurrentUser);

  // Form state
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    province: currentUser?.address?.province || 'Thành phố Hồ Chí Minh',
    district: currentUser?.address?.district || 'Quận 1',
    address: currentUser?.address?.detail || '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      dispatch(showToast({ message: 'Giỏ hàng của bạn đang trống', type: 'error' }));
      return;
    }

    setIsSubmitting(true);

    const paymentLabel =
      paymentMethod === 'vietqr'
        ? 'Chuyển khoản VietQR'
        : paymentMethod === 'cod'
        ? 'Thanh toán khi nhận hàng (COD)'
        : paymentMethod === 'card'
        ? 'Thẻ tín dụng / Ghi nợ quốc tế'
        : 'Chuyển khoản VietQR';

    const orderPayload = {
      customerInfo: formData,
      items: cartItems.map((item) => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      shippingFee,
      discountAmount,
      voucherCode: appliedVoucher ? appliedVoucher.code : '',
      total,
      paymentMethod: paymentLabel,
    };

    try {
      const res = await dispatch(createOrderApi(orderPayload));
      if (res.meta.requestStatus === 'fulfilled' && res.payload.order) {
        setCreatedOrder(res.payload.order);
        dispatch(clearCart());
        dispatch(removeVoucher());
        dispatch(
          showToast({
            message: `Đặt hàng thành công! Mã đơn: ${res.payload.order.orderCode}`,
            type: 'success',
          })
        );
      } else {
        dispatch(
          showToast({
            message: res.payload || 'Đặt hàng không thành công. Vui lòng thử lại.',
            type: 'error',
          })
        );
      }
    } catch (err) {
      dispatch(showToast({ message: 'Lỗi kết nối máy chủ', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-[#FAF9F6] min-h-[75vh] py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[#ECE7DF] p-8 sm:p-10 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF5EE] border border-[#E8DFD0] flex items-center justify-center mx-auto text-[#8A5B36]">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-xl font-serif text-gray-900 font-semibold mb-2">
              Yêu Cầu Đăng Nhập Để Thanh Toán
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Vui lòng đăng nhập tài khoản của bạn để tiếp tục quá trình thanh toán đơn hàng.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              to="/auth"
              className="block w-full py-3.5 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Đăng Nhập Ngay
            </Link>
            <Link
              to="/cart"
              className="block w-full py-3 border border-gray-300 hover:border-black text-gray-700 text-xs uppercase tracking-wider font-medium transition-colors"
            >
              Quay Lại Giỏ Hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !createdOrder) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-200">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-serif text-gray-900 mb-2">Không có sản phẩm nào để thanh toán</h2>
          <p className="text-xs text-gray-500 mb-6">Vui lòng chọn sản phẩm vào giỏ hàng trước khi tiếp tục.</p>
          <Link
            to="/products"
            className="px-6 py-3 bg-[#18181B] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors"
          >
            Mua Sắm Ngay
          </Link>
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
          <Link to="/cart" className="hover:text-black">Giỏ hàng</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">Thanh toán</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-serif font-light text-gray-900 mb-8 pb-4 border-b border-[#ECE7DF]">
          Thông Tin Thanh Toán
        </h1>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Cols: Customer Info & Payment Methods */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Thông tin giao hàng */}
              <div className="bg-white border border-[#ECE7DF] p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2 font-sans">
                  <Truck size={15} className="text-[#8A5B36]" />
                  1. THÔNG TIN GIAO HÀNG
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Email nhận thông báo đơn *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Tỉnh / Thành phố *</label>
                    <input
                      type="text"
                      required
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Quận / Huyện *</label>
                    <input
                      type="text"
                      required
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) *</label>
                    <input
                      type="text"
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Ghi chú giao hàng (tuỳ chọn)</label>
                    <textarea
                      rows={2}
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Ghi chú thêm cho shipper hoặc thời gian nhận hàng thuận tiện..."
                      className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Phương thức thanh toán */}
              <div className="bg-white border border-[#ECE7DF] p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2 font-sans">
                  <CreditCard size={15} className="text-[#8A5B36]" />
                  2. PHƯƠNG THỨC THANH TOÁN
                </h2>

                <div className="space-y-3">
                  {/* VietQR Bank Transfer */}
                  <label
                    className={`block p-4 border cursor-pointer transition-all rounded-xs ${
                      paymentMethod === 'vietqr'
                        ? 'border-[#18181B] bg-[#FAF8F5] ring-1 ring-[#18181B]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="vietqr"
                        checked={paymentMethod === 'vietqr'}
                        onChange={() => setPaymentMethod('vietqr')}
                        className="accent-[#18181B]"
                      />
                      <QrCode size={18} className="text-[#8A5B36]" />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-900 block">
                          Chuyển khoản nhanh qua VietQR (Khuyên dùng)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Quét mã QR qua ứng dụng ngân hàng bất kỳ, xác nhận tự động 24/7.
                        </span>
                      </div>
                    </div>

                    {paymentMethod === 'vietqr' && (
                      <div className="mt-4 p-4 bg-white border border-gray-200 text-xs flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                        <div className="w-28 h-28 bg-[#F0EDE6] p-2 border border-gray-300 flex flex-col items-center justify-center shrink-0">
                          <QrCode size={70} className="text-gray-800" />
                          <span className="text-[9px] font-bold mt-1 text-gray-600">VIETQR 24/7</span>
                        </div>
                        <div className="space-y-1.5 text-gray-700 text-[11px] text-left">
                          <p><strong>Ngân hàng:</strong> Techcombank (TCB)</p>
                          <p><strong>Số tài khoản:</strong> 1903 6688 9999</p>
                          <p><strong>Chủ tài khoản:</strong> LUXE STORE VIET NAM</p>
                          <p><strong>Số tiền:</strong> <span className="font-bold text-red-600">{formatCurrency(total)}</span></p>
                          <p><strong>Nội dung:</strong> LUXE {formData.phone.replace(/\s+/g, '')}</p>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* COD */}
                  <label
                    className={`block p-4 border cursor-pointer transition-all rounded-xs ${
                      paymentMethod === 'cod'
                        ? 'border-[#18181B] bg-[#FAF8F5] ring-1 ring-[#18181B]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#18181B]"
                      />
                      <Truck size={18} className="text-[#8A5B36]" />
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Thanh toán tiền mặt cho nhân viên giao hàng sau khi kiểm tra kiện hàng.
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Visa / Master */}
                  <label
                    className={`block p-4 border cursor-pointer transition-all rounded-xs ${
                      paymentMethod === 'card'
                        ? 'border-[#18181B] bg-[#FAF8F5] ring-1 ring-[#18181B]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#18181B]"
                      />
                      <CreditCard size={18} className="text-[#8A5B36]" />
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">
                          Thẻ tín dụng / Ghi nợ quốc tế (Visa, MasterCard, JCB)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Cổng thanh toán mã hóa an toàn tiêu chuẩn quốc tế.
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Order Review Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#ECE7DF] p-6 shadow-sm space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 pb-3 border-b border-gray-100 font-sans">
                  ĐƠN HÀNG CỦA BẠN ({cartItems.length} SẢN PHẨM)
                </h2>

                {/* Items preview list */}
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="py-3 flex gap-3 items-center">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80'}
                        alt={item.name}
                        className="w-14 h-16 object-cover object-top rounded-xs bg-[#F7F5F0] border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-500">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                        <span className="text-xs font-bold text-gray-800">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-gray-900">
                      {shippingFee === 0 ? <span className="text-emerald-700 font-bold">Miễn phí</span> : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Mã giảm giá ({appliedVoucher.code})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase text-gray-900">Tổng thanh toán</span>
                    <span className="text-xl font-extrabold text-[#18181B]">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Đang xử lý đơn hàng...</span>
                  ) : (
                    <>
                      <span>Hoàn Tất Đặt Hàng</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#8A5B36]" />
                  Cam kết bảo mật thông tin & chính sách đổi trả 30 ngày
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Order Success Modal Confirmation */}
      {createdOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white max-w-lg w-full p-8 shadow-2xl z-10 text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A5B36]">
                ĐẶT HÀNG THÀNH CÔNG
              </span>
              <h2 className="text-2xl font-serif text-gray-900 mt-1">Cảm ơn bạn đã lựa chọn LUXE!</h2>
              <p className="text-xs text-gray-500 mt-2">
                Mã đơn hàng: <strong className="text-gray-900 font-mono text-sm">{createdOrder.orderCode || createdOrder.id || createdOrder._id}</strong>
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gray-200 text-left text-xs space-y-2">
              <p><strong>Người nhận:</strong> {createdOrder.customerInfo?.fullName} ({createdOrder.customerInfo?.phone})</p>
              <p><strong>Địa chỉ:</strong> {createdOrder.customerInfo?.address}, {createdOrder.customerInfo?.district}, {createdOrder.customerInfo?.province}</p>
              <p><strong>Phương thức:</strong> {createdOrder.paymentMethod}</p>
              <p><strong>Tổng thanh toán:</strong> <strong className="text-red-600 font-semibold">{formatCurrency(createdOrder.total)}</strong></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/account"
                className="flex-1 py-3 bg-[#18181B] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors"
              >
                Theo Dõi Đơn Hàng
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 text-xs uppercase tracking-wider font-semibold hover:border-black transition-colors"
              >
                Về Trang Chủ
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
