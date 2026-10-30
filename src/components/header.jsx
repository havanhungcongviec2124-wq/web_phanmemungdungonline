import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Gift
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTotalItemsCount, selectWishlist, setDrawerOpen } from '../redux/cart/cartSlice';
import { selectCategories } from '../redux/category/categorySlice';
import { selectProducts } from '../redux/product/productSlice';
import { selectCurrentUser } from '../redux/Auth/authSlice';
import { formatCurrency } from '../utils/format';
import GiftAdvisorModal from './GiftAdvisorModal';

const Header = () => {
  const dispatch = useDispatch();
  const totalItemsCount = useSelector(selectTotalItemsCount);
  const wishlist = useSelector(selectWishlist);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const currentUser = useSelector(selectCurrentUser);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsCategoryDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search filtered products from Redux store
  const searchResults = searchQuery.trim()
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE6DF] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
            {/* Mobile hamburger button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-800 hover:text-black focus:outline-none"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Left: Brand Logo */}
            <div className="shrink-0 flex items-center">
              <Link to="/" className="inline-block group whitespace-nowrap">
                <span className="text-2xl sm:text-2xl lg:text-3xl font-extrabold tracking-[0.22em] text-[#18181B] font-serif uppercase">
                  LUXE<span className="font-light text-[#8A5B36] ml-1">GIFTS</span>
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-800 shrink-0">
              <Link
                to="/products?giftType=combo"
                className="whitespace-nowrap hover:text-[#8A5B36] transition-colors py-2 flex items-center gap-1.5"
              >
                <span>🎁 HỘP QUÀ COMBO</span>
              </Link>

              <Link
                to="/products?giftType=single"
                className="whitespace-nowrap hover:text-[#8A5B36] transition-colors py-2 flex items-center gap-1.5"
              >
                <span>✨ QUÀ LẺ</span>
              </Link>

              {/* Smart Advisor Trigger */}
              <button
                onClick={() => setIsAdvisorOpen(true)}
                className="whitespace-nowrap text-[#8A5B36] hover:text-[#5E3A1E] transition-colors py-2 flex items-center gap-1 font-bold cursor-pointer relative"
              >
                <Sparkles size={14} />
                <span>GỢI Ý THEO DỊP</span>
              </button>

              {/* Categories dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                <Link
                  to="/products"
                  className="whitespace-nowrap hover:text-[#8A5B36] transition-colors py-2 flex items-center gap-1"
                >
                  DANH MỤC QUÀ
                  <ChevronDown size={14} />
                </Link>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-[#EBE6DE] shadow-xl p-3 grid grid-cols-1 gap-1 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 tracking-wider">
                      CHỦNG LOẠI QUÀ TẶNG
                    </div>
                    {categories.map(cat => (
                      <Link
                        key={cat._id || cat.id}
                        to={`/products?category=${cat.slug}`}
                        className="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#F8F5EE] hover:text-[#8A5B36] flex items-center justify-between transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-gray-400">({cat.count || 20})</span>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to="/products"
                        className="px-3 py-1.5 text-xs font-semibold text-[#18181B] hover:text-[#8A5B36] flex items-center gap-1"
                      >
                        Xem tất cả quà tặng <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/contact"
                className="whitespace-nowrap hover:text-[#8A5B36] transition-colors py-2"
              >
                LIÊN HỆ
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-48 xl:w-60 pl-9 pr-3 py-2 bg-[#F6F4EE] border border-transparent focus:border-[#D0C8BB] text-xs text-gray-800 placeholder-gray-400 focus:outline-none transition-all"
                  />
                  <Search size={15} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                </form>

                {/* Mobile Search Icon */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-black"
                  aria-label="Tìm kiếm"
                >
                  <Search size={20} />
                </button>

                {/* Search Results Dropdown */}
                {isSearchOpen && searchQuery.trim().length > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[#E6E1D8] shadow-2xl p-4 z-50">
                    <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3 flex justify-between">
                      <span>Kết quả gợi ý ({searchResults.length})</span>
                      <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-black">
                        <X size={14} />
                      </button>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-500">
                        Không tìm thấy sản phẩm phù hợp với "{searchQuery}"
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map((item) => (
                          <Link
                            key={item._id || item.id}
                            to={`/product/${item._id || item.id}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="py-2.5 flex items-center gap-3 hover:bg-[#FAF8F5] p-2 transition-colors"
                          >
                            <img
                              src={item.images?.[0]}
                              alt={item.name}
                              className="w-12 h-14 object-cover object-top bg-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-gray-900 truncate">{item.name}</h4>
                              <p className="text-[11px] text-gray-500">{item.categoryName}</p>
                              <span className="text-xs font-semibold text-[#18181B] mt-0.5 block">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs text-[#8A5B36] font-semibold hover:underline"
                      >
                        Xem tất cả kết quả cho "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Icon */}
              <Link
                to={currentUser ? "/account" : "/auth"}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title={currentUser ? `Tài khoản (${currentUser.fullName})` : "Đăng nhập / Đăng ký"}
              >
                <User size={20} />
              </Link>

              {/* Wishlist Icon */}
              <Link
                to="/account?tab=wishlist"
                className="relative p-2 text-gray-700 hover:text-black transition-colors"
                title="Yêu thích"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8A5B36] text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button
                onClick={() => dispatch(setDrawerOpen(true))}
                className="relative p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag size={20} />
                {currentUser && totalItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#18181B] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#ECE7DF] bg-[#FAF9F6] px-4 py-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DCD5C9] text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            </form>

            <div className="flex flex-col space-y-3 text-sm font-semibold tracking-wider uppercase text-gray-800">
              <Link to="/" className="py-2 border-b border-gray-200/50">Trang Chủ</Link>
              <Link to="/products?tag=collection" className="py-2 border-b border-gray-200/50">Bộ Sưu Tập</Link>
              <Link to="/products?tag=new" className="py-2 border-b border-gray-200/50">Sản Phẩm Mới</Link>
              <Link to="/products" className="py-2 border-b border-gray-200/50">Danh Mục</Link>
              <Link to="/contact" className="py-2 border-b border-gray-200/50">Liên Hệ</Link>
              <Link to="/cart" className="py-2 border-b border-gray-200/50 flex justify-between items-center">
                <span>Giỏ hàng</span>
                {currentUser && totalItemsCount > 0 && (
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">{totalItemsCount}</span>
                )}
              </Link>
              <Link to={currentUser ? "/account" : "/auth"} className="py-2 border-b border-gray-200/50">
                {currentUser ? 'Tài Khoản & Đơn Hàng' : 'Đăng Nhập / Đăng Ký'}
              </Link>
              <Link to="/admin" className="py-2 text-amber-700 flex items-center gap-2">
                Quản Trị (Admin)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Gift Advisor Modal — render ngoài header, dùng Portal trong component */}
      <GiftAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />
    </>
  );
};

export default Header;