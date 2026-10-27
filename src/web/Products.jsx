import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts } from '../redux/product/productSlice';
import { fetchProductsApi } from '../redux/product/productApi';
import { selectCategories } from '../redux/category/categorySlice';
import { fetchCategoriesApi } from '../redux/category/categoryApi';
import { PRODUCTS, CATEGORIES, formatCurrency } from '../data/mockData';

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

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available brands
  const brands = ['Tất cả', 'LUXE STUDIO', 'Premium Linen', 'Heritage Silk', 'Modern Tailor', 'LUXE Leather', 'LUXE Optical'];
  const sizes = ['all', 'S', 'M', 'L', 'XL'];
  const colorList = [
    { name: 'all', label: 'Tất cả', hex: '#ccc' },
    { name: 'Đen', label: 'Đen', hex: '#111111' },
    { name: 'Be', label: 'Be', hex: '#D4C5B9' },
    { name: 'Trắng', label: 'Trắng', hex: '#FFFFFF' },
    { name: 'Ghi xám', label: 'Ghi xám', hex: '#8E9196' },
    { name: 'Nâu', label: 'Nâu', hex: '#7E5835' },
    { name: 'Xanh', label: 'Xanh', hex: '#556B2F' }
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    return sourceProducts.filter(product => {
      // Search query
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchCategory = product.categoryName.toLowerCase().includes(q);
        if (!matchName && !matchCategory) return false;
      }

      // Tag filter
      if (tagParam === 'new' && !product.isNew) return false;
      if (tagParam === 'bestseller' && !product.isBestSeller) return false;
      if (tagParam === 'sale' && product.discountPercent === 0) return false;

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) return false;

      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = product.colors?.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }

      // Price filter
      if (product.price > maxPrice) return false;

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'bestseller') return b.soldCount - a.soldCount;
      return 0; // default newest
    });
  }, [categoryParam, tagParam, queryParam, selectedCategory, selectedSize, selectedColor, maxPrice, selectedBrand, sortBy]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(3000000);
    setSelectedBrand('all');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 3000000 ||
    selectedBrand !== 'all' ||
    Boolean(queryParam) ||
    Boolean(tagParam);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching Figma */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-black">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-black">Sản phẩm</Link>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-900 capitalize">
                {CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
          {tagParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-900 uppercase">
                {tagParam === 'new' ? 'Sản Phẩm Mới' : tagParam === 'bestseller' ? 'Bán Chạy Nhất' : 'Bộ Sưu Tập'}
              </span>
            </>
          )}
        </nav>

        {/* Page Title & Mobile Filter Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D7] gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-light text-gray-900 tracking-tight">
              {queryParam
                ? `Kết quả tìm kiếm cho "${queryParam}"`
                : tagParam === 'new'
                ? 'Sản Phẩm Mới Về'
                : tagParam === 'bestseller'
                ? 'Sản Phẩm Bán Chạy Nhất'
                : selectedCategory !== 'all'
                ? CATEGORIES.find(c => c.slug === selectedCategory)?.name || 'Danh Sách Sản Phẩm'
                : 'Tất Cả Sản Phẩm'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm trong bộ sưu tập
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-white border border-gray-300 text-xs font-semibold uppercase flex items-center gap-2 shadow-xs"
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
                className="bg-white border border-gray-300 text-xs py-2 px-3 font-medium text-gray-800 focus:outline-hidden focus:border-black rounded-xs"
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

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-[#EDE8DF]">
            <span className="text-xs text-gray-500 font-medium">Đang lọc theo:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Danh mục: {CATEGORIES.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}
            {selectedSize !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Size: {selectedSize}
                <button onClick={() => setSelectedSize('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}
            {selectedColor !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Màu: {selectedColor}
                <button onClick={() => setSelectedColor('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Hãng: {selectedBrand}
                <button onClick={() => setSelectedBrand('all')} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}
            {maxPrice < 3000000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F5F2EB] text-xs text-gray-800 rounded-xs">
                Dưới {formatCurrency(maxPrice)}
                <button onClick={() => setMaxPrice(3000000)} className="hover:text-red-600"><X size={12} /></button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 font-semibold underline ml-2 hover:text-red-800"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* 2 Columns: Filter Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar (Exact Figma product-listing filter sidebar) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8 bg-white p-6 border border-[#ECE7DF] h-fit">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900 font-sans">
                BỘ LỌC TÌM KIẾM
              </h3>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-[11px] text-[#8A5B36] font-semibold hover:underline">
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* DANH MỤC */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                DANH MỤC
              </h4>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between text-left py-1 hover:text-[#8A5B36] transition-colors ${
                    selectedCategory === 'all' ? 'font-bold text-[#8A5B36]' : 'text-gray-600'
                  }`}
                >
                  <span>Tất cả sản phẩm</span>
                  <span className="text-[11px] text-gray-400">{PRODUCTS.length}</span>
                </button>
                {CATEGORIES.map((cat, index) => (
                  <button
                    key={cat.id || cat._id || cat.slug || index}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full flex items-center justify-between text-left py-1 hover:text-[#8A5B36] transition-colors ${
                      selectedCategory === cat.slug ? 'font-bold text-[#8A5B36]' : 'text-gray-600'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] text-gray-400">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* KÍCH CỠ */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                KÍCH CỠ
              </h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-9 h-9 px-2 text-xs font-medium border rounded-xs transition-colors ${
                      selectedSize === size
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                    }`}
                  >
                    {size === 'all' ? 'Tất cả' : size}
                  </button>
                ))}
              </div>
            </div>

            {/* MÀU SẮC */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                MÀU SẮC
              </h4>
              <div className="flex flex-wrap gap-2">
                {colorList.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 border rounded-xs transition-all ${
                      selectedColor === c.name
                        ? 'border-[#18181B] bg-[#F7F5F0] font-bold text-gray-900'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {c.name !== 'all' && (
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }} />
                    )}
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* KHOẢNG GIÁ */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  KHOẢNG GIÁ
                </h4>
                <span className="text-xs font-semibold text-[#8A5B36]">
                  {formatCurrency(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="3000000"
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#18181B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>500.000đ</span>
                <span>3.000.000đ</span>
              </div>
            </div>

            {/* THƯƠNG HIỆU */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                THƯƠNG HIỆU
              </h4>
              <div className="space-y-1.5 text-xs">
                {brands.map(b => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-black">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === (b === 'Tất cả' ? 'all' : b)}
                      onChange={() => setSelectedBrand(b === 'Tất cả' ? 'all' : b)}
                      className="accent-[#18181B]"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-16 text-center border border-[#ECE7DF] space-y-4">
                <Filter size={40} className="mx-auto text-gray-300" />
                <h3 className="text-lg font-serif text-gray-800">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Hãy thử điều chỉnh lại bộ lọc hoặc giá để tìm thấy những sản phẩm ưng ý nhất.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#18181B] text-white text-xs uppercase font-semibold tracking-wider hover:bg-black transition-colors"
                >
                  Xóa toàn bộ bộ lọc
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product._id || product.id || index} product={product} />
                  ))}
                </div>

                {/* Pagination (Matching Figma < 1 2 3 >) */}
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button className="w-9 h-9 border border-gray-300 bg-white text-gray-500 flex items-center justify-center text-xs hover:border-black disabled:opacity-50">
                    &lt;
                  </button>
                  <button className="w-9 h-9 border border-[#18181B] bg-[#18181B] text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </button>
                  <button className="w-9 h-9 border border-gray-300 bg-white text-gray-700 flex items-center justify-center text-xs hover:border-black">
                    2
                  </button>
                  <button className="w-9 h-9 border border-gray-300 bg-white text-gray-700 flex items-center justify-center text-xs hover:border-black">
                    3
                  </button>
                  <button className="w-9 h-9 border border-gray-300 bg-white text-gray-500 flex items-center justify-center text-xs hover:border-black">
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Slide Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-xl p-6 overflow-y-auto space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-bold text-xs uppercase tracking-wider">Bộ lọc tìm kiếm</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}><X size={20} /></button>
              </div>

              {/* Mobile Category */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-2">Danh mục</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300"
                >
                  <option value="all">Tất cả sản phẩm</option>
                  {CATEGORIES.map((c, index) => <option key={c.id || c._id || c.slug || index} value={c.slug}>{c.name}</option>)}
                </select>
              </div>

              {/* Mobile Size */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-2">Kích cỡ</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs border ${selectedSize === s ? 'bg-black text-white' : 'bg-white'}`}
                    >
                      {s === 'all' ? 'Tất cả' : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-1">Mức giá tối đa: {formatCurrency(maxPrice)}</h4>
                <input
                  type="range"
                  min="500000"
                  max="3000000"
                  step="100000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 border border-gray-300 text-xs font-medium"
                >
                  Đặt lại
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-black text-white text-xs font-semibold"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
