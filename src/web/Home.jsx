import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  Gift,
  Heart,
  Calendar,
  CheckCircle2,
  DollarSign,
  Filter
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import GiftAdvisorModal from '../components/GiftAdvisorModal';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts } from '../redux/product/productSlice';
import { fetchProductsApi } from '../redux/product/productApi';
import { selectCategories } from '../redux/category/categorySlice';
import { fetchCategoriesApi } from '../redux/category/categoryApi';
import { CATEGORIES, PRODUCTS, OCCASIONS, PRICE_RANGES, GIFT_TYPES } from '../data/mockData';

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);

  // Modal Trợ lý chọn quà
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Widget gợi ý quà trực tiếp trên trang chủ
  const [widgetOccasion, setWidgetOccasion] = useState('all');
  const [widgetPrice, setWidgetPrice] = useState('all');
  const [widgetGiftType, setWidgetGiftType] = useState('all');

  React.useEffect(() => {
    if (products.length === 0) dispatch(fetchProductsApi());
    if (categories.length === 0) dispatch(fetchCategoriesApi());
  }, [dispatch, products.length, categories.length]);

  const displayProducts = products.length > 0 ? products : PRODUCTS;
  const displayCategories = categories.length > 0 ? categories : CATEGORIES;

  // Lọc theo widget tương tác
  const priceFilter = PRICE_RANGES.find(p => p.id === widgetPrice) || PRICE_RANGES[0];
  const suggestedGifts = displayProducts.filter(p => {
    if (widgetOccasion !== 'all' && !p.occasions?.includes(widgetOccasion)) return false;
    if (p.price < priceFilter.min || p.price > priceFilter.max) return false;
    if (widgetGiftType !== 'all' && p.giftType !== widgetGiftType) return false;
    return true;
  });

  // Nhóm quà Combo & Quà Lẻ
  const comboGifts = displayProducts.filter(p => p.giftType === 'combo').slice(0, 4);
  const singleGifts = displayProducts.filter(p => p.giftType === 'single').slice(0, 4);
  const bestSellers = displayProducts.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="bg-[#FAF9F6] text-[#1E1E1E]">
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[75vh] min-h-130 max-h-195 bg-[#1B1917] overflow-hidden">
        {/* Background Editorial Gift Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2000&auto=format&fit=crop"
            alt="LUXE GIFTS - Quà Tặng & Combo Tinh Tế"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.72] contrast-[1.05] transition-transform duration-1000 scale-100 hover:scale-102"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl text-white space-y-5 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/25 text-[11px] uppercase tracking-[0.25em] font-medium text-amber-200">
              <Gift size={13} />
              Nghệ Thuật Trao Quà Tinh Tế 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-[1.15]">
              Trao Gửi Yêu Thương <br />
              <span className="font-normal italic text-[#E0C097]">Trọn Vẹn Ý Nghĩa</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed max-w-md">
              Mỗi món quà lẻ và set combo tại LUXE GIFTS đều được gói ghém thủ công tỉ mỉ, đi kèm thiệp chúc viết tay và hoa sáp vĩnh cửu.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsAdvisorOpen(true)}
                className="px-7 py-3.5 bg-linear-to-r from-[#D4AF37] to-[#8A5B36] hover:from-[#E5C158] hover:to-[#9E693F] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl inline-flex items-center gap-2 group cursor-pointer"
              >
                <Sparkles size={14} />
                Gợi Ý Quà Theo Dịp
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/products?giftType=combo"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/60 text-white text-xs font-semibold uppercase tracking-widest transition-colors backdrop-blur-xs"
              >
                Xem Hộp Quà Combo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR */}
      <section className="border-b border-[#ECE7DF] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center justify-center p-2">
              <Gift size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Gói Hộp Quà Miễn Phí</h4>
              <p className="text-[11px] text-gray-500 mt-1">Hộp nhung, nơ lụa & thiệp viết tay</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <Truck size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Giao Quà Hỏa Tốc</h4>
              <p className="text-[11px] text-gray-500 mt-1">Giao hẹn giờ chính xác ngày sinh nhật/cưới</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <Sparkles size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Khắc Tên Theo Yêu Cầu</h4>
              <p className="text-[11px] text-gray-500 mt-1">Khắc laser lên bút ký, bình nước, hộp gỗ</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <ShieldCheck size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Đổi Trả An Tâm 30 Ngày</h4>
              <p className="text-[11px] text-gray-500 mt-1">Cam kết 100% quà chính hãng, chỉn chu</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BỘ GỢI Ý QUÀ TẶNG TRỰC TIẾP (WIZARD SECTION) */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-[#1C1917] to-[#292524] text-white p-6 sm:p-10 rounded-xs shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/15">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase block mb-1">
                  BỘ CÔNG CỤ TÌM KIẾM THÔNG MINH
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-white">
                  Bạn Đang Tìm Quà Tặng Cho Dịp Nào?
                </h2>
              </div>
              <p className="text-xs text-gray-300 max-w-sm">
                Chọn dịp sự kiện, ngân sách và loại quà để nhận ngay các gợi ý phù hợp nhất chỉ trong vài giây.
              </p>
            </div>

            {/* Bộ Lọc 3 Bước Nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 p-4 sm:p-5 rounded-xs backdrop-blur-md border border-white/15">
              {/* Bước 1: Dịp sự kiện */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E0C097] flex items-center gap-1.5">
                  <Calendar size={13} />
                  1. Dịp sự kiện (Cưới, Sinh nhật...)
                </label>
                <select
                  value={widgetOccasion}
                  onChange={(e) => setWidgetOccasion(e.target.value)}
                  className="w-full bg-[#18181B] text-white text-xs border border-white/20 rounded-xs p-2.5 focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
                >
                  {OCCASIONS.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              {/* Bước 2: Chọn khoảng giá */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E0C097] flex items-center gap-1.5">
                  <DollarSign size={13} />
                  2. Mức giá mong muốn
                </label>
                <select
                  value={widgetPrice}
                  onChange={(e) => setWidgetPrice(e.target.value)}
                  className="w-full bg-[#18181B] text-white text-xs border border-white/20 rounded-xs p-2.5 focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
                >
                  {PRICE_RANGES.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Bước 3: Quà lẻ hay quà combo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E0C097] flex items-center gap-1.5">
                  <Gift size={13} />
                  3. Hình thức quà (Lẻ hoặc Combo)
                </label>
                <select
                  value={widgetGiftType}
                  onChange={(e) => setWidgetGiftType(e.target.value)}
                  className="w-full bg-[#18181B] text-white text-xs border border-white/20 rounded-xs p-2.5 focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
                >
                  {GIFT_TYPES.map(g => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hiển thị kết quả gợi ý theo bộ lọc */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-300 mb-4">
                <span>Tìm thấy <strong className="text-white">{suggestedGifts.length}</strong> gợi ý phù hợp:</span>
                <Link
                  to={`/products?occasion=${widgetOccasion}&giftType=${widgetGiftType}`}
                  className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  Xem toàn bộ kết quả lọc <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {suggestedGifts.slice(0, 4).map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DANH MỤC PHỔ BIẾN */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[11px] font-semibold tracking-widest text-[#8A5B36] uppercase block mb-1">
              BỘ SƯU TẬP QUÀ TẶNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
              Khám Phá Theo Chủng Loại
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#8A5B36] flex items-center gap-1 group"
          >
            Xem tất cả danh mục quà
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat._id || cat.id || cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group relative flex flex-col items-center overflow-hidden bg-white border border-[#EBE6DC] hover:border-[#8A5B36] transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <div className="aspect-4/5 w-full overflow-hidden bg-[#F2EFE9]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <div className="p-3 w-full text-center bg-white group-hover:bg-[#FAF8F5] transition-colors">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-wide font-serif">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-500">{cat.count || 20} món quà</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. QUÀ COMBO NỔI BẬT */}
      <section className="py-16 bg-white border-y border-[#ECE7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D7]">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#8A5B36] uppercase block mb-1">
                TRỌN VẸN YÊU THƯƠNG
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
                Hộp Quà & Combo Sang Trọng
              </h2>
            </div>
            <Link
              to="/products?giftType=combo"
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#8A5B36] flex items-center gap-1 group"
            >
              Xem tất cả quà combo
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comboGifts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. MẶT HÀNG QUÀ LẺ TINH TUYỂN */}
      <section className="py-16 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D7]">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#8A5B36] uppercase block mb-1">
                ĐỘC ĐÁO & TINH TẾ
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
                Mặt Hàng Quà Lẻ Tinh Tuyển
              </h2>
            </div>
            <Link
              to="/products?giftType=single"
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#8A5B36] flex items-center gap-1 group"
            >
              Xem tất cả quà lẻ
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {singleGifts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. QUÀ BÁN CHẠY NHẤT */}
      <section className="py-16 bg-[#F6F4EE] border-t border-[#ECE7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E0D8CB]">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#8A5B36] uppercase block mb-1">
                ĐƯỢC YÊU THÍCH NHẤT
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
                Quà Tặng Bán Chạy Nhất
              </h2>
            </div>
            <Link
              to="/products?tag=bestseller"
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#8A5B36] flex items-center gap-1 group"
            >
              Xem tất cả quà hot
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal Trợ Lý Gợi Ý Quà */}
      <GiftAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />
    </div>
  );
};

export default Home;