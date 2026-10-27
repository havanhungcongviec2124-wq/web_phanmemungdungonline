import React, { useState } from 'react';
import { Sparkles, X, Gift, Check, ArrowRight, Heart, ShoppingBag, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProducts,
  selectOccasions,
  selectPriceRanges,
  selectGiftTypes,
} from '../redux/product/productSlice';
import { addToCart, setDrawerOpen } from '../redux/cart/cartSlice';
import { showToast } from '../redux/ui/uiSlice';
import { formatCurrency } from '../utils/format';

const GiftAdvisorModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const occasions = useSelector(selectOccasions);
  const priceRanges = useSelector(selectPriceRanges);
  const giftTypes = useSelector(selectGiftTypes);

  const [selectedOccasion, setSelectedOccasion] = useState('cuoi');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedGiftType, setSelectedGiftType] = useState('all');

  if (!isOpen) return null;

  // Filter matching gifts based on criteria
  const priceConfig = priceRanges.find(p => p.id === selectedPriceRange) || { min: 0, max: 10000000 };

  const matchedGifts = products.filter(product => {
    // 1. Occasion match
    if (selectedOccasion !== 'all') {
      const matchOcc = product.occasions?.includes(selectedOccasion);
      if (!matchOcc) return false;
    }

    // 2. Price match
    if (product.price < priceConfig.min || product.price > priceConfig.max) {
      return false;
    }

    // 3. Gift type match (single / combo)
    if (selectedGiftType !== 'all' && product.giftType !== selectedGiftType) {
      return false;
    }

    return true;
  });

  const handleQuickAdd = (product) => {
    dispatch(
      addToCart({
        product,
        quantity: 1,
        color: 'Tiêu chuẩn',
        size: 'Hộp quà cao cấp'
      })
    );
    dispatch(showToast({ message: `Đã thêm "${product.name}" vào giỏ quà!`, type: 'success' }));
    dispatch(setDrawerOpen(true));
  };

  const resetCriteria = () => {
    setSelectedOccasion('all');
    setSelectedPriceRange('all');
    setSelectedGiftType('all');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FAF9F6] border border-[#E8E1D5] max-w-4xl w-full rounded-xs shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#18181B] text-white p-5 sm:p-6 flex items-center justify-between border-b border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#8A5B36] to-[#D4AF37] flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E0C097] block">
                TRỢ LÝ CHỌN QUÀ THÔNG MINH
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-light text-white">
                Gợi Ý Món Quà Tinh Tế & Phù Hợp Nhất
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wizard Controls */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#ECE7DF] space-y-5">
          {/* Step 1: Chọn dịp sự kiện */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2 mb-2.5">
              <span className="w-5 h-5 rounded-full bg-[#8A5B36] text-white text-[10px] flex items-center justify-center font-bold">1</span>
              Chọn Dịp / Sự Kiện Tặng Quà:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {occasions.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`p-2.5 text-left border rounded-xs transition-all text-xs cursor-pointer ${
                    selectedOccasion === occ.id
                      ? 'border-[#8A5B36] bg-[#FAF5EE] text-[#8A5B36] font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="font-semibold truncate">{occ.name}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">{occ.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 & 3: Chọn mức giá & Phân loại quà */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Step 2: Chọn khoảng giá */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2 mb-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8A5B36] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Mức Ngân Sách Dự Kiến:
              </label>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => setSelectedPriceRange(pr.id)}
                    className={`px-3 py-1.5 text-xs rounded-xs font-medium border cursor-pointer transition-all ${
                      selectedPriceRange === pr.id
                        ? 'bg-[#8A5B36] border-[#8A5B36] text-white shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Chọn loại quà lẻ / quà combo */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2 mb-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8A5B36] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Hình Thức Quà Tặng:
              </label>
              <div className="flex gap-2">
                {giftTypes.map((gt) => (
                  <button
                    key={gt.id}
                    onClick={() => setSelectedGiftType(gt.id)}
                    className={`flex-1 py-1.5 px-3 text-xs rounded-xs border text-center cursor-pointer transition-all ${
                      selectedGiftType === gt.id
                        ? 'bg-[#18181B] border-[#18181B] text-white font-semibold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {gt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <span className="text-xs font-bold uppercase text-gray-700 tracking-wider">
              Kết Quả Gợi Ý Phù Hợp ({matchedGifts.length} món quà)
            </span>
            <button
              onClick={resetCriteria}
              className="text-xs text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Đặt lại bộ lọc
            </button>
          </div>

          {matchedGifts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Gift size={36} className="mx-auto text-gray-300" />
              <p className="text-sm text-gray-600 font-medium">
                Chưa có món quà nào khớp hoàn toàn với cả 3 tiêu chí của bạn.
              </p>
              <button
                onClick={resetCriteria}
                className="px-4 py-2 bg-[#8A5B36] text-white text-xs uppercase font-semibold rounded-xs"
              >
                Xem tất cả các món quà có sẵn
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {matchedGifts.slice(0, 6).map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white border border-[#ECE7DF] hover:border-[#8A5B36] p-3 rounded-xs flex flex-col justify-between group transition-all duration-300 hover:shadow-lg"
                >
                  <div className="space-y-2.5">
                    <div className="aspect-4/3 w-full bg-gray-100 overflow-hidden relative rounded-xs">
                      <img
                        src={gift.images?.[0]}
                        alt={gift.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs shadow-xs ${
                        gift.giftType === 'combo' ? 'bg-[#8A5B36] text-white' : 'bg-black text-white'
                      }`}>
                        {gift.giftType === 'combo' ? 'Combo Set' : 'Quà Lẻ'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8A5B36] font-semibold uppercase tracking-wider block">
                        {gift.categoryName}
                      </span>
                      <h4 className="text-xs sm:text-sm font-serif font-semibold text-gray-900 line-clamp-1 group-hover:text-[#8A5B36] transition-colors">
                        <Link to={`/product/${gift.id}`} onClick={onClose}>
                          {gift.name}
                        </Link>
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                        {gift.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(gift.price)}
                      </span>
                      {gift.originalPrice > gift.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(gift.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Song song đã bán & còn tồn */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 bg-[#FAF8F5] p-1.5 rounded-xs">
                      <span>Đã bán: <strong className="text-gray-800">{gift.soldCount ?? 0}</strong></span>
                      <span>Còn tồn: <strong className="text-emerald-700">{gift.stock ?? 0}</strong></span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleQuickAdd(gift)}
                        className="flex-1 py-1.5 bg-[#18181B] hover:bg-black text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={12} />
                        Chọn Món Này
                      </button>
                      <Link
                        to={`/product/${gift.id}`}
                        onClick={onClose}
                        className="px-2.5 py-1.5 border border-gray-300 hover:border-black text-gray-700 text-[11px] rounded-xs flex items-center justify-center"
                        title="Xem chi tiết"
                      >
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-gray-500">
            * Tất cả quà tặng đều được đóng gói sẵn hộp cao cấp kèm thiệp viết tay miễn phí.
          </span>
          <Link
            to="/products"
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-[#8A5B36] hover:underline flex items-center gap-1"
          >
            Khám phá toàn bộ danh mục quà tặng <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GiftAdvisorModal;
