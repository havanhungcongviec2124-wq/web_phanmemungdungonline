import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectTotalItemsCount,
  selectSubtotal,
  selectShippingFee,
  selectDiscountAmount,
  selectTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../redux/cart/cartSlice';
import {
  selectAppliedVoucher,
  selectVouchers,
  removeVoucher,
} from '../redux/voucher/voucherSlice';
import { validateVoucherApi, fetchVouchersApi } from '../redux/voucher/voucherApi';
import { selectCurrentUser } from '../redux/Auth/authSlice';
import { showToast } from '../redux/ui/uiSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const totalItemsCount = useSelector(selectTotalItemsCount);
  const subtotal = useSelector(selectSubtotal);
  const shippingFee = useSelector(selectShippingFee);
  const discountAmount = useSelector(selectDiscountAmount);
  const total = useSelector(selectTotal);
  const appliedVoucher = useSelector(selectAppliedVoucher);
  const vouchers = useSelector(selectVouchers);
  const currentUser = useSelector(selectCurrentUser);

  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => {
    dispatch(fetchVouchersApi());
  }, [dispatch]);

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    const code = voucherCode.trim();
    if (!code) return;

    const res = await dispatch(validateVoucherApi({ code, subtotal }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ message: res.payload.message || 'Áp dụng mã thành công!', type: 'success' }));
      setVoucherCode('');
    } else {
      dispatch(showToast({ message: res.payload || 'Mã giảm giá không hợp lệ', type: 'error' }));
    }
  };

  const handleQuickApplyVoucher = async (code) => {
    const res = await dispatch(validateVoucherApi({ code, subtotal }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ message: res.payload.message || 'Áp dụng mã thành công!', type: 'success' }));
    } else {
      dispatch(showToast({ message: res.payload || 'Mã giảm giá không hợp lệ', type: 'error' }));
    }
  };

  const handleRemoveVoucher = () => {
    dispatch(removeVoucher());
    dispatch(showToast({ message: 'Đã hủy áp dụng mã giảm giá', type: 'info' }));
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      dispatch(clearCart());
      dispatch(showToast({ message: 'Đã dọn sạch giỏ hàng', type: 'info' }));
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-[#FAF9F6] min-h-[75vh] py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[#ECE7DF] p-8 sm:p-10 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF5EE] border border-[#E8DFD0] flex items-center justify-center mx-auto text-[#8A5B36]">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h2 className="text-xl font-serif text-gray-900 font-semibold mb-2">
              Yêu Cầu Đăng Nhập
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Vui lòng đăng nhập vào tài khoản để xem các sản phẩm trong giỏ hàng, áp dụng mã ưu đãi và tiến hành đặt hàng.
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
              to="/products"
              className="block w-full py-3 border border-gray-300 hover:border-black text-gray-700 text-xs uppercase tracking-wider font-medium transition-colors"
            >
              Tiếp Tục Khám Phá Sản Phẩm
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
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-black">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-900">Giỏ hàng của bạn</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-serif font-light text-gray-900 mb-8 pb-4 border-b border-[#ECE7DF]">
          Giỏ Hàng Của Bạn <span className="text-base text-gray-500 font-sans">({totalItemsCount} sản phẩm)</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-16 text-center border border-[#ECE7DF] max-w-xl mx-auto space-y-4">
            <ShoppingBag size={52} className="mx-auto text-gray-300" />
            <h2 className="text-xl font-serif text-gray-800">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs text-gray-500">
              Hãy dạo qua các bộ sưu tập tuyệt đẹp của LUXE STORE để lựa chọn những thiết kế ưng ý nhất.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#18181B] text-white text-xs uppercase font-semibold tracking-widest hover:bg-black transition-colors"
              >
                Khám Phá Sản Phẩm Ngay
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 8 Cols: Cart Items Table */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#ECE7DF] overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 bg-[#FAF8F5]">
                  <div className="col-span-6">Sản Phẩm</div>
                  <div className="col-span-2 text-center">Đơn Giá</div>
                  <div className="col-span-2 text-center">Số Lượng</div>
                  <div className="col-span-2 text-right">Tổng Tiền</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="p-4 sm:p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="sm:col-span-6 flex gap-4 items-center">
                          <Link to={`/product/${item.id}`} className="shrink-0">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80'}
                              alt={item.name}
                              className="w-20 h-24 object-cover object-top rounded-xs bg-[#F7F5F0] border border-gray-100"
                            />
                          </Link>
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#8A5B36] uppercase font-bold tracking-wider">
                              {item.categoryName || 'Thời trang'}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 hover:text-[#8A5B36] transition-colors">
                              <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>Màu: <strong className="text-gray-700">{item.color}</strong></span>
                              <span>•</span>
                              <span>Size: <strong className="text-gray-700">{item.size}</strong></span>
                            </div>
                            <button
                              onClick={() => {
                                dispatch(removeFromCart(index));
                                dispatch(showToast({ message: `Đã xóa "${item.name}"`, type: 'info' }));
                              }}
                              className="text-[11px] text-gray-400 hover:text-red-600 flex items-center gap-1 pt-1 transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} /> Xóa
                            </button>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div className="sm:col-span-2 text-left sm:text-center text-sm font-semibold text-gray-800">
                          <span className="sm:hidden text-xs text-gray-400 font-normal mr-2">Đơn giá:</span>
                          {formatCurrency(item.price)}
                        </div>

                        {/* Quantity Counter */}
                        <div className="sm:col-span-2 flex justify-start sm:justify-center">
                          <div className="flex items-center border border-gray-300 rounded-xs bg-white">
                            <button
                              onClick={() => dispatch(updateQuantity({ index, delta: -1 }))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-9 text-center text-xs font-semibold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(updateQuantity({ index, delta: 1 }))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="sm:col-span-2 text-left sm:text-right text-sm font-bold text-[#18181B]">
                          <span className="sm:hidden text-xs text-gray-400 font-normal mr-2">Tổng:</span>
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="text-xs uppercase font-semibold tracking-wider text-gray-700 hover:text-black flex items-center gap-2"
                >
                  <ArrowLeft size={14} />
                  Tiếp tục mua sắm
                </Link>
                <button
                  onClick={handleClearCart}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors underline cursor-pointer"
                >
                  Xóa tất cả sản phẩm
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Order Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#ECE7DF] p-6 shadow-sm space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 pb-3 border-b border-gray-100 font-sans">
                  TÓM TẮT ĐƠN HÀNG
                </h2>

                {/* Subtotal & Shipping */}
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-gray-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-[11px]">Miễn phí</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>

                  {/* Free shipping banner */}
                  {subtotal < 1000000 && (
                    <div className="p-2.5 bg-[#FAF7F0] border border-[#EBE4D5] text-[11px] text-amber-900 leading-tight">
                      Mua thêm <strong>{formatCurrency(1000000 - subtotal)}</strong> để nhận <strong>Miễn phí vận chuyển</strong> toàn quốc!
                    </div>
                  )}

                  {/* Discount */}
                  {appliedVoucher && (
                    <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                      <span>Giảm giá ({appliedVoucher.code})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Voucher Box */}
                <div className="pt-3 border-t border-gray-100">
                  <form onSubmit={handleApplyVoucher} className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                      <Tag size={12} /> Mã Giảm Giá / Voucher
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập mã (VD: LUXE2026)"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 uppercase focus:outline-hidden focus:border-black"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#18181B] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Áp Dụng
                      </button>
                    </div>
                  </form>

                  {/* Suggested Vouchers quick badges */}
                  {vouchers && vouchers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {vouchers.map((v) => (
                        <button
                          key={v.code}
                          type="button"
                          onClick={() => handleQuickApplyVoucher(v.code)}
                          className={`text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                            appliedVoucher?.code === v.code
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-black'
                          }`}
                        >
                          {v.code}
                        </button>
                      ))}
                    </div>
                  )}

                  {appliedVoucher && (
                    <div className="mt-2 text-xs flex justify-between items-center text-emerald-700 bg-emerald-50 p-2">
                      <span>✓ {appliedVoucher.desc || `Giảm ${appliedVoucher.discount}%`}</span>
                      <button onClick={handleRemoveVoucher} className="text-red-500 hover:underline text-[11px] cursor-pointer">
                        Hủy
                      </button>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-wider text-gray-900">Tổng cộng</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-[#18181B]">
                      {formatCurrency(total)}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-0.5">(Đã bao gồm VAT)</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
                >
                  Tiến Hành Thanh Toán
                  <ArrowRight size={14} />
                </button>

                <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#8A5B36]" />
                  Bảo mật thanh toán chuẩn SSL 256-bit
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
