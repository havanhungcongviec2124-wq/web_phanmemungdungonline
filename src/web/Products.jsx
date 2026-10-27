import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  X,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Gift,
  Calendar,
  DollarSign,
  RotateCcw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import GiftAdvisorModal from '../components/GiftAdvisorModal';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts } from '../redux/product/productSlice';
import { fetchProductsApi } from '../redux/product/productApi';
import { selectCategories } from '../redux/category/categorySlice';
import { fetchCategoriesApi } from '../redux/category/categoryApi';
import {
  PRODUCTS,
  CATEGORIES,
  OCCASIONS,
  PRICE_RANGES,
  GIFT_TYPES,
  formatCurrency
} from '../data/mockData';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);

  React.useEffect(() => {
    if (products.length === 0) dispatch(fetchProductsApi());
    if (categories.length === 0) dispatch(fetchCategoriesApi());
  }, [dispatch, products.length, categories.length]);

  const sourceProducts = products.length > 0 ? products : PRODUCTS;
  const sourceCategories = categories.length > 0 ? categories : CATEGORIES;

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');
  const queryParam = searchParams.get('q');
  const giftTypeParam = searchParams.get('giftType');
  const occasionParam = searchParams.get('occasion');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedGiftType, setSelectedGiftType] = useState(giftTypeParam || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState(occasionParam || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Sync state if URL params change
  React.useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (giftTypeParam) setSelectedGiftType(giftTypeParam);
    if (occasionParam) setSelectedOccasion(occasionParam);
  }, [categoryParam, giftTypeParam, occasionParam]);

  // Filtering products
  const filteredProducts = useMemo(() => {
    const activePriceRange = PRICE_RANGES.find(p => p.id === selectedPriceRange) || PRICE_RANGES[0];

    return sourceProducts.filter(product => {
      // 1. Search query
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(q);
        const matchCategory = product.categoryName?.toLowerCase().includes(q);
        const matchDesc = product.shortDesc?.toLowerCase().includes(q);
        if (!matchName && !matchCategory && !matchDesc) return false;
      }

      // 2. Tag filter
      if (tagParam === 'new' && !product.isNew) return false;
      if (tagParam === 'bestseller' && !product.isBestSeller) return false;
      if (tagParam === 'sale' && (product.discountPercent || 0) === 0) return false;

      // 3. Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

      // 4. Gift type filter (single / combo)
      if (selectedGiftType !== 'all' && product.giftType !== selectedGiftType) return false;

      // 5. Occasion filter (cưới, sinh nhật, tân gia, kỷ niệm...)
      if (selectedOccasion !== 'all' && !product.occasions?.includes(selectedOccasion)) return false;

      // 6. Price range preset
      if (product.price < activePriceRange.min || product.price > activePriceRange.max) return false;

      // 7. Max price slider
      if (product.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'bestseller') return (b.soldCount || 0) - (a.soldCount || 0);
      return 0; // default newest
    });
  }, [
    sourceProducts,
    queryParam,
    tagParam,
    selectedCategory,
    selectedGiftType,
    selectedOccasion,
    selectedPriceRange,
    maxPrice,
    sortBy
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedGiftType('all');
    setSelectedOccasion('all');
    setSelectedPriceRange('all');
    setMaxPrice(3000000);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedGiftType !== 'all' ||
    selectedOccasion !== 'all' ||
    selectedPriceRange !== 'all' ||
    maxPrice < 3000000 ||
    Boolean(queryParam) ||
    Boolean(tagParam);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-black">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-black">Quà tặng</Link>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-900 capitalize">
                {sourceCategories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
          {selectedGiftType !== 'all' && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-900 uppercase font-semibold">
                {selectedGiftType === 'combo' ? 'Hộp Quà Combo' : 'Mặt Hàng Quà Lẻ'}
              </span>
            </>
          )}
        </nav>

        {/* Page Title & Smart Advisor Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D7] gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-gray-900 tracking-tight">
              {queryParam
                ? `Kết quả tìm kiếm cho "${queryParam}"`
                : selectedGiftType === 'combo'
                ? 'Hộp Quà & Combo Sang Trọng'
                : selectedGiftType === 'single'
                ? 'Mặt Hàng Quà Tặng Lẻ Tinh Tuyển'
                : selectedOccasion !== 'all'
                ? `Quà Tặng Dịp ${OCCASIONS.find(o => o.id === selectedOccasion)?.name || ''}`
                : selectedCategory !== 'all'
                ? sourceCategories.find(c => c.slug === selectedCategory)?.name || 'Danh Sách Quà Tặng'
                : 'Tất Cả Món Quà & Combo'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Hiển thị <strong>{filteredProducts.length}</strong> món quà phù hợp
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Nút Mở Trợ Lý Gợi Ý Quà */}
            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="px-4 py-2 bg-linear-to-r from-[#D4AF37] to-[#8A5B36] hover:from-[#E5C158] hover:to-[#9E693F] text-white text-xs font-bold uppercase rounded-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Trợ Lý Gợi Ý Quà</span>
            </button>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-white border border-gray-300 text-xs font-semibold uppercase flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              Bộ lọc
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 hidden sm:inline">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 text-xs py-2 px-3 font-medium text-gray-800 focus:outline-hidden focus:border-black rounded-xs cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="bestseller">Bán chạy nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Gift Type Tabs (Tất cả, Quà Lẻ, Quà Combo) */}
        <div className="flex items-center gap-2 pb-6 overflow-x-auto">
          {GIFT_TYPES.map((gt) => (
            <button
              key={gt.id}
              onClick={() => setSelectedGiftType(gt.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all cursor-pointer whitespace-nowrap ${
                selectedGiftType === gt.id
                  ? 'bg-[#18181B] text-white border-[#18181B] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}
            >
              {gt.id === 'combo' && '🎁 '}
              {gt.id === 'single' && '✨ '}
              {gt.label}
            </button>
          ))}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-[#EDE8DF]">
            <span className="text-xs text-gray-500 font-medium">Đang lọc theo:</span>

            {selectedOccasion !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF5EE] text-xs text-[#8A5B36] font-semibold rounded-xs border border-[#E8DFD0]">
                Dịp: {OCCASIONS.find(o => o.id === selectedOccasion)?.name}
                <button onClick={() => setSelectedOccasion('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}

            {selectedGiftType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Loại: {selectedGiftType === 'combo' ? 'Quà Combo' : 'Quà Lẻ'}
                <button onClick={() => setSelectedGiftType('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}

            {selectedPriceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Khoảng giá: {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}
                <button onClick={() => setSelectedPriceRange('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Danh mục: {sourceCategories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}

            {maxPrice < 3000000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Tối đa {formatCurrency(maxPrice)}
                <button onClick={() => setMaxPrice(3000000)} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-red-600 font-semibold underline ml-2 hover:text-red-800 cursor-pointer"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* 2 Columns: Filter Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 border border-[#ECE7DF] h-fit rounded-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900">
                BỘ LỌC QUÀ TẶNG
              </h3>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-[11px] text-[#8A5B36] font-semibold hover:underline cursor-pointer">
                  Đặt lại
                </button>
              )}
            </div>

            {/* DỊP SỰ KIỆN (CƯỚI, SINH NHẬT, TÂN GIA...) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#8A5B36]" />
                DỊP / SỰ KIỆN TẶNG QUÀ
              </h4>
              <div className="space-y-1.5">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`w-full text-left py-1.5 px-2 rounded-xs text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedOccasion === occ.id
                        ? 'bg-[#FAF5EE] text-[#8A5B36] font-bold border-l-2 border-[#8A5B36]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{occ.name}</span>
                    {selectedOccasion === occ.id && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* KHOẢNG GIÁ DỰ KIẾN */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                <DollarSign size={13} className="text-[#8A5B36]" />
                NGÂN SÁCH DỰ KIẾN
              </h4>
              <div className="space-y-1.5">
                {PRICE_RANGES.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => setSelectedPriceRange(pr.id)}
                    className={`w-full text-left py-1.5 px-2 rounded-xs text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedPriceRange === pr.id
                        ? 'bg-[#FAF5EE] text-[#8A5B36] font-bold border-l-2 border-[#8A5B36]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{pr.label}</span>
                    {selectedPriceRange === pr.id && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>

              {/* Slider lọc tối đa */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                  <span>Trượt mức giá tối đa:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="3000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8A5B36] cursor-pointer"
                />
              </div>
            </div>

            {/* DANH MỤC QUÀ */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                <Gift size={13} className="text-[#8A5B36]" />
                DANH MỤC QUÀ TẶNG
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left py-1.5 px-2 rounded-xs text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#FAF5EE] text-[#8A5B36] font-bold border-l-2 border-[#8A5B36]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>Tất cả danh mục</span>
                  <span className="text-[10px] text-gray-400">{sourceProducts.length}</span>
                </button>
                {sourceCategories.map((cat) => (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-1.5 px-2 rounded-xs text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-[#FAF5EE] text-[#8A5B36] font-bold border-l-2 border-[#8A5B36]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">{cat.count || 20}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-16 text-center border border-[#ECE7DF] space-y-4 rounded-xs">
                <Gift size={48} className="mx-auto text-gray-300" />
                <h3 className="text-lg font-serif text-gray-900 font-medium">
                  Không tìm thấy món quà phù hợp
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Hãy thử mở rộng khoảng giá hoặc chọn dịp tặng quà khác để xem thêm nhiều lựa chọn nhé.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Xem Tất Cả Quà Tặng
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 lg:hidden">
          <div className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-sm font-bold uppercase text-gray-900">Bộ Lọc Quà Tặng</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            {/* Dịp sự kiện */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-800 mb-2">Dịp tặng quà</h4>
              <div className="space-y-1">
                {OCCASIONS.map(occ => (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`w-full text-left py-1.5 px-2 text-xs rounded-xs ${selectedOccasion === occ.id ? 'bg-[#8A5B36] text-white font-bold' : 'text-gray-700'}`}
                  >
                    {occ.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Hình thức quà */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-800 mb-2">Hình thức quà</h4>
              <div className="flex gap-2">
                {GIFT_TYPES.map(gt => (
                  <button
                    key={gt.id}
                    onClick={() => setSelectedGiftType(gt.id)}
                    className={`flex-1 py-1.5 text-xs rounded-xs border text-center ${selectedGiftType === gt.id ? 'bg-black text-white font-bold' : 'text-gray-700'}`}
                  >
                    {gt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ngân sách */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-800 mb-2">Mức giá</h4>
              <div className="space-y-1">
                {PRICE_RANGES.map(pr => (
                  <button
                    key={pr.id}
                    onClick={() => setSelectedPriceRange(pr.id)}
                    className={`w-full text-left py-1.5 px-2 text-xs rounded-xs ${selectedPriceRange === pr.id ? 'bg-[#8A5B36] text-white font-bold' : 'text-gray-700'}`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#18181B] text-white text-xs uppercase font-bold tracking-wider rounded-xs mt-6"
            >
              Xem Kết Quả ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* Modal Trợ Lý Gợi Ý Quà */}
      <GiftAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />
    </div>
  );
};

export default Products;
