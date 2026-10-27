import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleWishlist, setDrawerOpen, selectWishlist } from '../redux/cart/cartSlice';
import { selectCurrentUser } from '../redux/Auth/authSlice';
import { showToast } from '../redux/ui/uiSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector(selectWishlist);
  const currentUser = useSelector(selectCurrentUser);
  const productId = product._id || product.id;
  const wishlisted = wishlist.includes(String(productId));

  const handleAddToCart = () => {
    if (!currentUser) {
      dispatch(showToast({ message: 'Vui lòng đăng nhập để thêm vào giỏ hàng', type: 'info' }));
      navigate('/auth');
      return;
    }
    dispatch(
      addToCart({
        product,
        size: product.sizes?.[0] || 'Tiêu chuẩn',
        color: product.colors?.[0]?.name || 'Tiêu chuẩn',
        quantity: 1,
      })
    );
    dispatch(
      showToast({
        message: `Đã thêm "${product.name}" vào giỏ hàng`,
        type: 'success',
      })
    );
    dispatch(setDrawerOpen(true));
  };

  const handleToggleWishlist = () => {
    if (!currentUser) {
      dispatch(showToast({ message: 'Vui lòng đăng nhập để lưu yêu thích', type: 'info' }));
      navigate('/auth');
      return;
    }
    dispatch(toggleWishlist(productId));
    dispatch(
      showToast({
        message: wishlisted
          ? `Đã xóa khỏi danh sách yêu thích`
          : `Đã thêm vào danh sách yêu thích`,
        type: 'info',
      })
    );
  };

  return (
    <div className="group relative flex flex-col bg-white border border-[#F0EDE8] hover:border-[#D5CEBF] transition-all duration-300 hover:shadow-xl rounded-xs">
      {/* Product Image & Badges */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F7F5F2]">
        <Link to={`/product/${productId}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.badge && (
            <span
              className={`text-[10px] tracking-widest font-semibold uppercase px-2.5 py-1 ${
                product.badge.includes('%')
                  ? 'bg-[#B91C1C] text-white'
                  : product.badge === 'MỚI'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-[#8A5B36] text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
              wishlisted
                ? 'bg-red-50 text-red-600 scale-110'
                : 'bg-white/90 text-gray-700 hover:bg-black hover:text-white'
            }`}
            title={wishlisted ? 'Bỏ thích' : 'Yêu thích'}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Hover Quick Add Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#18181B] hover:bg-[#2E2E33] text-white text-xs font-medium tracking-wider uppercase py-2.5 px-3 flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <ShoppingBag size={14} />
            Thêm vào giỏ
          </button>
          <Link
            to={`/product/${productId}`}
            className="w-10 bg-white hover:bg-[#F3EFEA] text-gray-800 flex items-center justify-center shadow-lg transition-colors"
            title="Xem chi tiết"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>

        {/* Product Information */}
        <div className="p-4 flex flex-col grow justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#8C827A] uppercase tracking-wider mb-1.5">
              <span className={`font-semibold px-2 py-0.5 rounded-xs text-[10px] ${
                product.giftType === 'combo'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {product.giftType === 'combo' ? '🎁 Hộp Quà Combo' : '✨ Quà Tặng Lẻ'}
              </span>
              <div className="flex items-center gap-1 text-[#C4883A]">
                <Star size={11} fill="currentColor" />
                <span className="font-semibold text-gray-700">{product.rating || 5}</span>
                <span className="text-gray-400">({product.reviewCount || 12})</span>
              </div>
            </div>

            <h3 className="font-normal text-sm sm:text-base text-[#1A1A1A] hover:text-[#8A5B36] transition-colors line-clamp-1 font-serif">
              <Link to={`/product/${productId}`}>{product.name}</Link>
            </h3>

            {/* If combo, show combo items teaser */}
            {product.comboItems && product.comboItems.length > 0 && (
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 italic">
                Bao gồm: {product.comboItems.map(i => i.name).join(', ')}
              </p>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-[#F5F2EB]">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-bold text-[#18181B]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discountPercent > 0 && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-xs">
                  -{product.discountPercent}%
                </span>
              )}
            </div>

            {/* Song song: Đã bán & Còn tồn */}
            <div className="mt-2.5 pt-2 border-t border-dashed border-[#EFECE6] flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-gray-500">
                <span>Đã bán:</span>
                <strong className="text-gray-800 font-semibold">{product.soldCount ?? 0}</strong>
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-gray-500">
                <span>Còn tồn:</span>
                <strong className={(product.stock ?? 0) <= 5 ? "text-amber-700 font-bold" : "text-emerald-700 font-semibold"}>
                  {product.stock ?? 0}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;
