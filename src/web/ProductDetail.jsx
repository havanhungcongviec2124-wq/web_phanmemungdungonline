import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Ruler,
  X,
  Share2,
  Check,
  Gift
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProducts,
  selectSelectedProduct,
  selectProductLoading,
} from '../redux/product/productSlice';
import { fetchProductByIdApi, fetchProductsApi } from '../redux/product/productApi';
import {
  addToCart,
  toggleWishlist,
  setDrawerOpen,
  selectWishlist,
} from '../redux/cart/cartSlice';
import { selectCurrentUser } from '../redux/Auth/authSlice';
import { showToast } from '../redux/ui/uiSlice';
import { formatCurrency } from '../utils/format';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const selectedProduct = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductLoading);
  const wishlist = useSelector(selectWishlist);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProductsApi());
    }
    if (id) {
      dispatch(fetchProductByIdApi(id));
    }
  }, [id, dispatch, products.length]);

  const product =
    selectedProduct ||
    products.find((p) => p._id === id || p.id === id) ||
    products[0] || {
      name: 'Đang tải...',
      price: 0,
      images: [],
      colors: [],
      sizes: ['S', 'M', 'L'],
    };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Be');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Cập nhật selectedColor & selectedSize khi product thay đổi
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]?.name || product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setSelectedImage(0);
    }
  }, [product?._id, product?.id]);

  const productId = product._id || product.id || id;
  const wishlisted = wishlist.includes(String(productId));

  // Sản phẩm tương tự từ danh sách backend
  const similarProducts = products
    .filter((p) => p._id !== productId && p.id !== productId)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!currentUser) {
      dispatch(showToast({ message: 'Vui lòng đăng nhập để thêm vào giỏ hàng', type: 'info' }));
      navigate('/auth');
      return;
    }
    dispatch(
      addToCart({
        product,
        color: selectedColor,
        size: selectedSize,
        quantity,
      })
    );
    dispatch(
      showToast({
        message: `Đã thêm ${quantity} "${product.name}" vào giỏ hàng`,
        type: 'success',
      })
    );
    dispatch(setDrawerOpen(true));
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      dispatch(showToast({ message: 'Vui lòng đăng nhập để mua hàng', type: 'info' }));
      navigate('/auth');
      return;
    }
    dispatch(
      addToCart({
        product,
        color: selectedColor,
        size: selectedSize,
        quantity,
      })
    );
    navigate('/checkout');
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
          ? 'Đã xóa khỏi danh sách yêu thích'
          : 'Đã thêm vào danh sách yêu thích',
        type: 'info',
      })
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      dispatch(showToast({ message: 'Đã sao chép liên kết sản phẩm!', type: 'success' }));
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12 text-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-black">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-black">Sản phẩm</Link>
          <ChevronRight size={12} />
          <Link to={`/products?category=${product.category}`} className="hover:text-black">
            {product.categoryName}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Product Layout (2 columns matching Figma product-detail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">
          {/* Left Column: Gallery (Thumbs + Main View) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {(product.images && product.images.length > 0 ? product.images : [product.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=900']).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border transition-all rounded-xs bg-[#F5F2EB] ${
                    selectedImage === index
                      ? 'border-[#18181B] ring-1 ring-[#18181B] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Main Big Photo View */}
            <div className="flex-1 aspect-3/4 bg-[#F2EFE9] overflow-hidden relative shadow-sm group">
              <img
                src={product.images?.[selectedImage] || product.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=900'}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#B91C1C] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Product Purchasing Info */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-widest mb-1.5">
                <span className="font-semibold text-[#8A5B36]">{product.brand || 'LUXE GIFTS'}</span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-black text-gray-400 cursor-pointer"
                  title="Chia sẻ"
                >
                  <Share2 size={14} /> Chia sẻ
                </button>
              </div>

              {/* Gift Type Badge */}
              <div className="mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xs text-xs font-bold uppercase tracking-wider ${
                  product.giftType === 'combo'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-100 text-stone-800 border border-stone-200'
                }`}>
                  {product.giftType === 'combo' ? '🎁 Hộp Quà Combo Trọn Gói' : '✨ Quà Tặng Lẻ Tinh Tuyển'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & Sold count */}
              <div className="mt-3 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-[#C4883A]">
                  <Star size={14} fill="currentColor" />
                  <span className="font-bold text-gray-800">{product.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 underline cursor-pointer">{product.reviewCount} đánh giá</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-700 font-semibold">Đã bán {product.soldCount ?? 0} món</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white border border-[#ECE7DF] flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#18181B]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-xs">
                    Tiết kiệm {formatCurrency(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Song song: Đã bán & Tồn kho indicator */}
            

            {/* Phù hợp các dịp tặng quà */}
            {product.occasions && product.occasions.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                  Phù Hợp Làm Quà Tặng Cho Dịp:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.occasions.map((occId) => (
                    <span
                      key={occId}
                      className="text-[11px] font-semibold bg-[#FAF5EE] text-[#8A5B36] border border-[#E8DFD0] px-2.5 py-1 rounded-xs"
                    >
                      {occId === 'cuoi' ? '💍 Cưới hỏi & Hỷ sự' :
                       occId === 'sinh-nhat' ? '🎂 Sinh nhật' :
                       occId === 'tan-gia' ? '🏡 Mừng tân gia' :
                       occId === 'ky-niem' ? '💖 Kỷ niệm & Tình yêu' :
                       occId === 'doanh-nghiep' ? '👔 Tri ân đối tác / Sếp' : occId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chi tiết các món bên trong Combo (Requirement 6, 7, 10) */}
            {product.comboItems && product.comboItems.length > 0 && (
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xs space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Gift size={14} className="text-[#8A5B36]" />
                  Bên Trong Hộp Quà Combo Gồm Có:
                </span>
                <ul className="space-y-1.5 divide-y divide-amber-100">
                  {product.comboItems.map((item, idx) => (
                    <li key={idx} className="pt-1.5 first:pt-0 flex items-start justify-between text-xs">
                      <div>
                        <strong className="text-gray-900 font-semibold">• {item.name}</strong>
                        {item.desc && <span className="text-gray-500 text-[11px] block ml-2">({item.desc})</span>}
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-800 shrink-0">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[11px] text-[#8A5B36] font-medium pt-1">
                  ✨ {product.giftBox || 'Tặng kèm hộp quà sang trọng, ruy băng lụa & thiệp viết tay miễn phí'}
                </div>
              </div>
            )}

            {/* ── Chọn Màu sắc (chỉ hiện khi sản phẩm có màu) ── */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Màu Sắc:
                  </span>
                  <span className="text-xs text-[#8A5B36] font-semibold">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => {
                    const colorName = c?.name || c;
                    const colorHex  = c?.hex  || '#ccc';
                    const isSelected = selectedColor === colorName;
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        title={colorName}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                          isSelected
                            ? 'border-[#8A5B36] ring-2 ring-[#8A5B36]/40 scale-110'
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: colorHex }}
                        aria-label={colorName}
                        aria-pressed={isSelected}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Chọn Kích thước / Size (chỉ hiện khi sản phẩm có size) ── */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Kích Thước / Size:
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] text-[#8A5B36] underline hover:no-underline font-medium"
                  >
                    Bảng quy đổi kích thước →
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-2 text-xs font-semibold border transition-all duration-150 rounded-xs ${
                          isSelected
                            ? 'bg-[#18181B] text-white border-[#18181B] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-700 hover:bg-gray-50'
                        }`}
                        aria-pressed={isSelected}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <div className='flex gap-2'>
                <div className="flex items-center border border-gray-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Giảm"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={quantity}
                    className="flex-1 text-center text-sm font-semibold text-gray-900 focus:outline-hidden"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Tăng"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-white border border-[#18181B] hover:bg-[#18181B] hover:text-white text-[#18181B] text-xs font-semibold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag size={16} />
                  Thêm Vào Giỏ Hàng
                </button>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 bg-[#18181B] hover:bg-black text-white text-xs font-semibold uppercase tracking-widest transition-all duration-200 shadow-lg text-center"
              >
                Mua Ngay
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`w-12 h-12 shrink-0 border border-gray-300 flex items-center justify-center transition-colors ${
                  wishlisted ? 'bg-red-50 text-red-600 border-red-300' : 'bg-white hover:border-black text-gray-700'
                }`}
                title={wishlisted ? 'Bỏ thích' : 'Yêu thích'}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="p-3 bg-[#FAF8F5] border border-[#ECE7DF] rounded-xs flex items-center justify-between text-xs">
              <div className="text-gray-700 font-medium">
                Đã bán được: <strong className="text-gray-900 font-bold">{product.soldCount ?? 0} sản phẩm</strong>
              </div>
              <div className="text-emerald-800 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Còn tồn kho: <strong>{product.stock ?? 20} hộp có sẵn</strong>
              </div>
            </div>
            {/* Policy highlights */}
            <div className="pt-4 border-t border-[#ECE7DF] grid grid-cols-1 gap-2.5 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[#8A5B36] shrink-0" />
                <span>Giao hàng miễn phí toàn quốc cho đơn hàng từ 1.000.000đ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw size={16} className="text-[#8A5B36] shrink-0" />
                <span>Chính sách đổi hàng trong vòng 30 ngày trên toàn hệ thống</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#8A5B36] shrink-0" />
                <span>Cam kết 100% chất lượng chuẩn thiết kế cao cấp độc quyền</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Material & Care, Reviews */}
        <div className="border-t border-[#E8E2D7] pt-12 mb-20">
          <div className="flex justify-center border-b border-gray-200 gap-8 mb-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-xs sm:text-sm uppercase tracking-widest font-semibold transition-all relative ${
                activeTab === 'desc'
                  ? 'text-[#18181B] border-b-2 border-[#18181B]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Mô Tả Sản Phẩm
            </button>
            <button
              onClick={() => setActiveTab('material')}
              className={`pb-4 text-xs sm:text-sm uppercase tracking-widest font-semibold transition-all relative ${
                activeTab === 'material'
                  ? 'text-[#18181B] border-b-2 border-[#18181B]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Chất Liệu & Bảo Quản
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-xs sm:text-sm uppercase tracking-widest font-semibold transition-all relative ${
                activeTab === 'reviews'
                  ? 'text-[#18181B] border-b-2 border-[#18181B]'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Đánh Giá ({product.reviewCount})
            </button>
          </div>

          <div className="max-w-3xl mx-auto text-sm leading-relaxed text-gray-700">
            {activeTab === 'desc' && (
              <div className="space-y-4 animate-fade-in">
                <p>{product.fullDesc}</p>
                <div className="p-4 bg-white border border-[#EFECE5] rounded-xs space-y-2 mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Đặc điểm nổi bật:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                    <li>Kỹ thuật cắt may tôn dáng theo chuẩn phom thời trang Ý.</li>
                    <li>Đường kim mũi chỉ được kiểm soát tinh vi bởi nghệ nhân lành nghề.</li>
                    <li>Khả năng phối đồ đa dạng từ phong cách thường ngày sang trọng đến tiệc đêm.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'material' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-white border border-[#EFECE5]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">Chất liệu:</h4>
                  <p className="text-xs text-gray-600">{product.material}</p>
                </div>
                <div className="p-4 bg-white border border-[#EFECE5]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">Hướng dẫn bảo quản:</h4>
                  <p className="text-xs text-gray-600">{product.care}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 p-4 bg-white border border-[#EFECE5]">
                  <div className="text-center pr-6 border-r border-gray-200">
                    <span className="text-3xl font-bold text-gray-900">{product.rating}</span>
                    <div className="flex text-[#C4883A] text-xs justify-center mt-1">
                      ★★★★★
                    </div>
                    <span className="text-[10px] text-gray-400">{product.reviewCount} lượt đánh giá</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>98% khách hàng hài lòng về chất lượng vải và form dáng chuẩn mực.</p>
                    <p>Dịch vụ đóng gói hộp quà cao cấp chuẩn phong cách LUXE.</p>
                  </div>
                </div>

                {/* Sample user reviews */}
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-[#F0EDE6] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-800">Phương Thảo (Hà Nội)</span>
                      <span className="text-gray-400">08/10/2026</span>
                    </div>
                    <div className="text-[#C4883A] text-xs">★★★★★</div>
                    <p className="text-xs text-gray-600">
                      Sản phẩm đẹp vượt mong đợi! Chất vải dạ mềm mại, không bị ngứa, form đứng chuẩn như hình mẫu của shop. Rất ưng ý!
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-[#F0EDE6] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-800">Minh Anh (TP.HCM)</span>
                      <span className="text-gray-400">04/10/2026</span>
                    </div>
                    <div className="text-[#C4883A] text-xs">★★★★★</div>
                    <p className="text-xs text-gray-600">
                      Đóng gói rất sang trọng, có cả túi bọc và móc treo chuyên dụng. Giao hàng hỏa tốc chỉ mất 1 ngày. Sẽ tiếp tục ủng hộ LUXE!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Section ("Sản Phẩm Tương Tự" in Figma) */}
        <div className="border-t border-[#E8E2D7] pt-16">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold tracking-widest text-[#8A5B36] uppercase block mb-1">
              GỢI Ý DÀNH CHO BẠN
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
              Sản Phẩm Tương Tự
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSizeGuideOpen(false)} />
          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold uppercase tracking-wider">Bảng Quy Đổi Kích Cỡ</h3>
              <button onClick={() => setIsSizeGuideOpen(false)}><X size={20} /></button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#FAF8F5]">
                    <th className="border p-2 font-bold">Size</th>
                    <th className="border p-2 font-bold">Vòng 1 (cm)</th>
                    <th className="border p-2 font-bold">Vòng 2 (cm)</th>
                    <th className="border p-2 font-bold">Vòng 3 (cm)</th>
                    <th className="border p-2 font-bold">Cân nặng (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-bold">S</td>
                    <td className="border p-2">82 - 86</td>
                    <td className="border p-2">64 - 68</td>
                    <td className="border p-2">88 - 92</td>
                    <td className="border p-2">45 - 50</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">M</td>
                    <td className="border p-2">86 - 90</td>
                    <td className="border p-2">68 - 72</td>
                    <td className="border p-2">92 - 96</td>
                    <td className="border p-2">51 - 56</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">L</td>
                    <td className="border p-2">90 - 94</td>
                    <td className="border p-2">72 - 76</td>
                    <td className="border p-2">96 - 100</td>
                    <td className="border p-2">57 - 62</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">XL</td>
                    <td className="border p-2">94 - 98</td>
                    <td className="border p-2">76 - 80</td>
                    <td className="border p-2">100 - 104</td>
                    <td className="border p-2">63 - 68</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 italic">
              * Số đo có thể chênh lệch 1-2cm tùy theo phom dáng của từng mẫu sản phẩm.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
