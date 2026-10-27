import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectIsDrawerOpen,
  setDrawerOpen,
  updateQuantity,
  removeFromCart,
  selectSubtotal,
  selectTotalItemsCount,
} from '../redux/cart/cartSlice';
import { selectCurrentUser } from '../redux/Auth/authSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const QuickCartDrawer = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isDrawerOpen = useSelector(selectIsDrawerOpen);
  const subtotal = useSelector(selectSubtotal);
  const totalItemsCount = useSelector(selectTotalItemsCount);
  const currentUser = useSelector(selectCurrentUser);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setDrawerOpen(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#18181B]" />
              <h2 className="text-base font-semibold text-gray-900 tracking-wide">
                GIỎ HÀNG CỦA BẠN ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => dispatch(setDrawerOpen(false))}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* If not logged in */}
          {!currentUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5EE] border border-[#E8DFD0] flex items-center justify-center text-[#8A5B36]">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="text-base font-serif font-semibold text-gray-900 mb-1.5">
                  Vui Lòng Đăng Nhập
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                  Bạn cần đăng nhập tài khoản để xem các sản phẩm trong giỏ hàng và tiến hành thanh toán.
                </p>
              </div>
              <Link
                to="/auth"
                onClick={() => dispatch(setDrawerOpen(false))}
                className="w-full max-w-xs py-3 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold transition-colors text-center"
              >
                Đăng Nhập Ngay
              </Link>
            </div>
          ) : (
            <>
              {/* Free shipping progress bar */}
              <div className="p-4 bg-[#F5F2EB] text-xs text-gray-700">
                {subtotal >= 1000000 ? (
                  <p className="text-emerald-700 font-medium text-center">
                    🎉 Bạn đã đủ điều kiện nhận <strong>Miễn phí giao hàng</strong> toàn quốc!
                  </p>
                ) : (
                  <div>
                    <p className="mb-1.5 text-center">
                      Mua thêm <strong>{formatCurrency(1000000 - subtotal)}</strong> để nhận Miễn phí giao hàng!
                    </p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#18181B] h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (subtotal / 1000000) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <ShoppingBag size={48} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm mb-4">Giỏ hàng của bạn đang trống</p>
                    <button
                      onClick={() => dispatch(setDrawerOpen(false))}
                      className="px-5 py-2.5 bg-[#18181B] text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-colors cursor-pointer"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="py-4 flex gap-4">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80'}
                        alt={item.name}
                        className="w-20 h-24 object-cover object-top rounded-xs bg-gray-50 shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                            <button
                              onClick={() => dispatch(removeFromCart(index))}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Màu: {item.color} | Size: {item.size}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-xs">
                            <button
                              onClick={() => dispatch(updateQuantity({ index, delta: -1 }))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-medium text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(updateQuantity({ index, delta: 1 }))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-xs font-semibold text-gray-800">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer actions */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-[#FAF9F6]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Tạm tính:</span>
                    <span className="text-base font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-4 text-center">
                    Phí vận chuyển và mã giảm giá được tính ở bước thanh toán.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/checkout"
                      onClick={() => dispatch(setDrawerOpen(false))}
                      className="w-full py-3.5 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                      Tiến hành thanh toán
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => dispatch(setDrawerOpen(false))}
                      className="w-full py-2.5 bg-white border border-gray-300 hover:border-black text-gray-800 text-xs uppercase tracking-wider font-medium text-center transition-colors"
                    >
                      Xem chi tiết giỏ hàng
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickCartDrawer;
