import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts } from '../redux/product/productSlice';
import { fetchProductsApi } from '../redux/product/productApi';
import { selectCategories } from '../redux/category/categorySlice';
import { fetchCategoriesApi } from '../redux/category/categoryApi';
import { CATEGORIES, PRODUCTS } from '../data/mockData';

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);

  React.useEffect(() => {
    if (products.length === 0) dispatch(fetchProductsApi());
    if (categories.length === 0) dispatch(fetchCategoriesApi());
  }, [dispatch, products.length, categories.length]);

  const displayProducts = products.length > 0 ? products : PRODUCTS;
  const displayCategories = categories.length > 0 ? categories : CATEGORIES;

  const newProducts = displayProducts.filter(p => p.isNew).slice(0, 4).length > 0
    ? displayProducts.filter(p => p.isNew).slice(0, 4)
    : displayProducts.slice(1, 5);

  const bestSellers = displayProducts.filter(p => p.isBestSeller).slice(0, 4).length > 0
    ? displayProducts.filter(p => p.isBestSeller).slice(0, 4)
    : displayProducts.slice(5, 9);

  return (
    <div className="bg-[#FAF9F6] text-[#1E1E1E]">
      {/* 1. HERO BANNER (Exact Figma home-page hero) */}
      <section className="relative w-full h-[75vh] min-h-130 max-h-195 bg-[#222] overflow-hidden">
        {/* Background Editorial Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Bộ Sưu Tập Mùa Thu 2026"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.82] contrast-[1.05] transition-transform duration-1000 scale-100 hover:scale-102"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl text-white space-y-5 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/25 text-[11px] uppercase tracking-[0.25em] font-medium text-amber-200">
              <Sparkles size={12} />
              Fall / Winter Collection 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-[1.15]">
              Bộ Sưu Tập <br />
              <span className="font-normal italic">Mùa Thu 2026</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed max-w-md">
              Nâng tầm phong cách của bạn với những thiết kế sang trọng, tối giản và thanh lịch nhất mùa này.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/products?tag=collection"
                className="px-8 py-3.5 bg-white text-[#18181B] hover:bg-[#F3EFEA] text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-xl inline-flex items-center gap-2 group"
              >
                Khám Phá Ngay
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="px-6 py-3.5 bg-transparent border border-white/70 hover:bg-white/10 text-white text-xs font-medium uppercase tracking-widest transition-colors"
              >
                Xem Danh Mục
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
              <Truck size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Giao Hàng Toàn Quốc</h4>
              <p className="text-[11px] text-gray-500 mt-1">Miễn phí cho đơn hàng từ 1.000.000đ</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <RefreshCw size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Đổi Trả Dễ Dàng</h4>
              <p className="text-[11px] text-gray-500 mt-1">Đổi hàng miễn phí trong vòng 30 ngày</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <Award size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Chất Liệu Tuyển Chọn</h4>
              <p className="text-[11px] text-gray-500 mt-1">Lụa tơ tằm, Linen hữu cơ, Cashmere</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
              <ShieldCheck size={24} className="text-[#8A5B36] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Cam Kết Chính Hãng</h4>
              <p className="text-[11px] text-gray-500 mt-1">100% thiết kế độc quyền LUXE STORE</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION ("Mua sắm theo chủng loại" in Figma) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[11px] font-semibold tracking-widest text-[#8A5B36] uppercase block mb-1">
              DANH MỤC PHỔ BIẾN
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
              Mua sắm theo chủng loại
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#8A5B36] flex items-center gap-1 group"
          >
            Xem tất cả danh mục
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (6 cards matching Figma) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat._id || cat.id || cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group relative flex flex-col items-center overflow-hidden bg-white border border-[#EBE6DC] hover:border-[#8A5B36] transition-all duration-300"
            >
              <div className="aspect-4/5 w-full overflow-hidden bg-[#F2EFE9]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <div className="p-3 w-full text-center bg-white group-hover:bg-[#FAF8F5] transition-colors">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase font-serif">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-500">{cat.count} sản phẩm</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS SECTION ("Sản Phẩm Mới" in Figma) */}
      <section className="py-16 bg-white border-y border-[#ECE7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D7]">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#8A5B36] uppercase block mb-1">
                HÀNG MỚI VỀ
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
                Sản Phẩm Mới
              </h2>
            </div>
            <Link
              to="/products?tag=new"
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#8A5B36] flex items-center gap-1 group"
            >
              Xem toàn bộ hàng mới
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Items in a Row matching Figma layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL LOOKBOOK PROMO BANNER */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#18181B] text-white overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-14 lg:p-16 space-y-6">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] block">
                EDITORIAL LOOKBOOK
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light leading-tight">
                Vẻ Đẹp Tối Giản <br />
                <span className="italic font-normal">Vượt Thời Gian</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                Mỗi thiết kế của LUXE STORE được chắt lọc từ những phom dáng kinh điển, tôn vinh khí chất thanh lịch tự nhiên của người phụ nữ hiện đại. Tinh tế từ đường kim, chỉn chu từ cấu trúc vải.
              </p>
              <div className="pt-2">
                <Link
                  to="/products?tag=collection"
                  className="inline-block px-7 py-3.5 bg-[#8A5B36] hover:bg-[#9E693F] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-lg"
                >
                  Khám Phá Lookbook
                </Link>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 lg:h-full min-h-95 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Lookbook"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS SECTION ("Bán Chạy Nhất" in Figma) */}
      <section className="py-16 bg-[#F6F4EE] border-t border-[#ECE7DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E0D8CB]">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#8A5B36] uppercase block mb-1">
                XU HƯỚNG NHẤT
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
                Bán Chạy Nhất
              </h2>
            </div>
            <Link
              to="/products?tag=bestseller"
              className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-[#8A5B36] flex items-center gap-1 group"
            >
              Xem tất cả sản phẩm hot
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Items in a Row matching Figma best sellers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM & COMMUNITY GALLERY BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#8A5B36] uppercase block mb-2">
          #LUXESTYLE ON INSTAGRAM
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900 mb-8">
          Chia sẻ phong cách cùng cộng đồng LUXE
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop"
          ].map((imgUrl, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-gray-100 group relative">
              <img
                src={imgUrl}
                alt="Luxe Community Style"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                @luxe_couture
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;