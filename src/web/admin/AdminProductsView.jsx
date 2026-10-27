import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Gift,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts, selectOccasions } from '../../redux/product/productSlice';
import { selectCategories } from '../../redux/category/categorySlice';
import {
  updateProductApi,
  createProductApi,
  deleteProductApi,
  fetchProductsApi,
  fetchProductMetaApi
} from '../../redux/product/productApi';
import { fetchCategoriesApi } from '../../redux/category/categoryApi';
import { showToast } from '../../redux/ui/uiSlice';
import { formatCurrency } from '../../utils/format';

const AdminProductsView = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const occasions = useSelector(selectOccasions);

  React.useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategoriesApi());
    if (occasions.length === 0) dispatch(fetchProductMetaApi());
  }, [dispatch, categories.length, occasions.length]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGiftType, setSelectedGiftType] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal Add / Edit product state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'hop-qua-combo',
    categoryName: 'Hộp Quà & Combo',
    giftType: 'combo',
    occasions: ['sinh-nhat'],
    price: '',
    originalPrice: '',
    stock: 20,
    soldCount: 0,
    sku: '',
    image: '',
    badge: 'MỚI',
    comboItemsText: 'Bình giữ nhiệt pastel, Hộp nến thơm 100g, Thiệp viết tay',
    giftBox: 'Hộp quà nắp nam châm thắt nơ lụa cao cấp'
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchName =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCat =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      p.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchType = selectedGiftType === 'all' || p.giftType === selectedGiftType;

    const matchOcc = selectedOccasion === 'all' || p.occasions?.includes(selectedOccasion);

    const matchStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'in_stock' && (p.stock || 0) > 0) ||
      (selectedStatus === 'out_of_stock' && (p.stock || 0) === 0);

    return matchName && matchCat && matchType && matchOcc && matchStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'hop-qua-combo',
      categoryName: 'Hộp Quà & Combo',
      giftType: 'combo',
      occasions: ['sinh-nhat'],
      price: '',
      originalPrice: '',
      stock: 25,
      soldCount: 0,
      sku: `GIFT-${Math.floor(100 + Math.random() * 900)}`,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80',
      badge: 'MỚI',
      comboItemsText: 'Hộp quà hoa hồng sáp, Nến thơm tự nhiên, Thiệp chúc mừng',
      giftBox: 'Hộp quà nắp nam châm thắt nơ lụa cao cấp'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    const comboText = Array.isArray(p.comboItems)
      ? p.comboItems.map(i => i.name).join(', ')
      : '';

    setFormData({
      name: p.name,
      category: p.category || 'hop-qua-combo',
      categoryName: p.categoryName || 'Hộp Quà & Combo',
      giftType: p.giftType || 'single',
      occasions: p.occasions || ['sinh-nhat'],
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock ?? 20,
      soldCount: p.soldCount ?? 0,
      sku: p.sku || `GIFT-${p._id?.slice(-4) || '001'}`,
      image: p.images?.[0] || '',
      badge: p.badge || '',
      comboItemsText: comboText,
      giftBox: p.giftBox || 'Hộp quà nắp nam châm thắt nơ lụa cao cấp'
    });
    setIsModalOpen(true);
  };

  const handleToggleStock = async (p) => {
    const pId = p._id || p.id;
    const newStock = (p.stock || 0) > 0 ? 0 : 25;
    const res = await dispatch(updateProductApi({ id: pId, stock: newStock }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ message: `Đã đổi trạng thái kho (${p.name}): ${newStock} sp`, type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Lỗi cập nhật tồn kho', type: 'error' }));
    }
  };

  const handleDeleteProduct = async (p) => {
    const pId = p._id || p.id;
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}"?`)) {
      const res = await dispatch(deleteProductApi(pId));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(showToast({ message: `Đã xóa sản phẩm "${p.name}"`, type: 'success' }));
      } else {
        dispatch(showToast({ message: 'Lỗi xóa sản phẩm', type: 'error' }));
      }
    }
  };

  const handleOccasionToggle = (occId) => {
    setFormData(prev => {
      const exists = prev.occasions.includes(occId);
      return {
        ...prev,
        occasions: exists ? prev.occasions.filter(o => o !== occId) : [...prev.occasions, occId]
      };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      dispatch(showToast({ message: 'Vui lòng điền đủ tên món quà và giá bán', type: 'error' }));
      return;
    }

    const parsedComboItems = formData.comboItemsText
      ? formData.comboItemsText.split(/[,;\n]/).map(s => s.trim()).filter(Boolean).map(name => ({ name, quantity: 1, desc: '' }))
      : [];

    const productPayload = {
      name: formData.name,
      category: formData.category,
      categoryName: formData.categoryName,
      giftType: formData.giftType,
      occasions: formData.occasions,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      discountPercent: formData.originalPrice > formData.price
        ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
        : 0,
      stock: Number(formData.stock),
      soldCount: Number(formData.soldCount || 0),
      sku: formData.sku,
      badge: formData.badge,
      images: [formData.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80'],
      comboItems: parsedComboItems,
      giftBox: formData.giftBox,
      shortDesc: `Món quà ${formData.giftType === 'combo' ? 'combo cao cấp' : 'tinh tuyển'} cho dịp ${formData.occasions.join(', ')}.`
    };

    if (editingProduct) {
      const pId = editingProduct._id || editingProduct.id;
      const res = await dispatch(updateProductApi({ id: pId, ...productPayload }));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(showToast({ message: `Đã cập nhật món quà "${formData.name}"`, type: 'success' }));
        setIsModalOpen(false);
      } else {
        dispatch(showToast({ message: 'Lỗi cập nhật sản phẩm', type: 'error' }));
      }
    } else {
      // Gọi API thêm sản phẩm mới thật vào backend / Redux
      const res = await dispatch(createProductApi(productPayload));
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(showToast({ message: `Thêm món quà mới "${formData.name}" thành công!`, type: 'success' }));
        setIsModalOpen(false);
      } else {
        dispatch(showToast({ message: 'Lỗi khi thêm món quà mới', type: 'error' }));
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter and Action Bar */}
      <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Loại quà: Quà lẻ vs Combo */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Hình thức:</span>
              <select
                value={selectedGiftType}
                onChange={(e) => {
                  setSelectedGiftType(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs border border-gray-300 rounded-xs py-2 px-3 bg-[#FAF8F5] focus:outline-hidden focus:border-black cursor-pointer font-medium"
              >
                <option value="all">Tất cả hình thức</option>
                <option value="combo">🎁 Quà Combo</option>
                <option value="single">✨ Quà Lẻ</option>
              </select>
            </div>

            {/* Dịp sự kiện */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Dịp sự kiện:</span>
              <select
                value={selectedOccasion}
                onChange={(e) => {
                  setSelectedOccasion(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs border border-gray-300 rounded-xs py-2 px-3 bg-[#FAF8F5] focus:outline-hidden focus:border-black cursor-pointer font-medium"
              >
                {occasions.map(occ => (
                  <option key={occ.id} value={occ.id}>{occ.name}</option>
                ))}
              </select>
            </div>

            {/* Danh mục */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Danh mục:</span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs border border-gray-300 rounded-xs py-2 px-3 bg-[#FAF8F5] focus:outline-hidden focus:border-black cursor-pointer font-medium"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Search box */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm món quà, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 bg-white rounded-xs focus:outline-hidden focus:border-black"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Add Product Button (Requirement 10: Nhập hàng mới) */}
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
          >
            <Plus size={15} />
            <span>+ Nhập Món Quà Mới</span>
          </button>
        </div>
      </div>

      {/* Main Products Table (Showing song song "ĐÃ BÁN" & "TỒN KHO") */}
      <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAF8F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">ẢNH</th>
                <th className="py-3.5 px-4">TÊN MÓN QUÀ</th>
                <th className="py-3.5 px-4 text-center">HÌNH THỨC</th>
                <th className="py-3.5 px-4">DỊP TẶNG</th>
                <th className="py-3.5 px-4">GIÁ BÁN</th>
                {/* Song song 1 sản phẩm có thông tin đã bán được & còn tồn */}
                <th className="py-3.5 px-4 text-center bg-amber-50/50">ĐÃ BÁN</th>
                <th className="py-3.5 px-4 text-center bg-emerald-50/50">CÒN TỒN</th>
                <th className="py-3.5 px-4 text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p, index) => {
                  const pId = p._id || p.id;
                  const inStock = (p.stock || 0) > 0;
                  const skuCode = p.sku || `GIFT-${100 + index}`;
                  const isCombo = p.giftType === 'combo';

                  return (
                    <tr key={pId} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=120&q=80'}
                          alt={p.name}
                          className="w-12 h-14 object-cover object-center rounded-xs border border-gray-100 bg-[#F5F2EB]"
                        />
                      </td>
                      <td className="py-3 px-4 max-w-[220px]">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{p.name}</h4>
                        <span className="text-[11px] text-[#8C827A]">{p.categoryName || 'Quà tặng'}</span>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{skuCode}</div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase ${
                          isCombo ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {isCombo ? '🎁 Quà Combo' : '✨ Quà Lẻ'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {p.occasions && p.occasions.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {p.occasions.map(o => (
                              <span key={o} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded-xs">
                                {o === 'cuoi' ? 'Cưới' : o === 'sinh-nhat' ? 'Sinh nhật' : o === 'tan-gia' ? 'Tân gia' : o === 'ky-niem' ? 'Kỷ niệm' : o}
                              </span>
                            ))}
                          </div>
                        ) : 'Tất cả dịp'}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.price)}
                      </td>

                      {/* Song song: ĐÃ BÁN */}
                      <td className="py-3 px-4 text-center bg-amber-50/20 whitespace-nowrap font-mono font-bold text-gray-800 text-sm">
                        {p.soldCount ?? 0}
                      </td>

                      {/* Song song: CÒN TỒN */}
                      <td className="py-3 px-4 text-center bg-emerald-50/20 whitespace-nowrap font-mono font-bold text-sm">
                        <span className={inStock ? 'text-emerald-700' : 'text-red-600'}>
                          {p.stock ?? 20}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-xs border ${
                            inStock
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {inStock ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                            title="Sửa thông tin"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                              inStock
                                ? 'text-emerald-700 hover:text-red-600 hover:bg-gray-100'
                                : 'text-gray-400 hover:text-emerald-700 hover:bg-gray-100'
                            }`}
                            title={inStock ? 'Chuyển sang Hết hàng' : 'Cập nhật lại Có hàng (25 sp)'}
                          >
                            {inStock ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Trang {currentPage} trên {totalPages} ({filteredProducts.length} món quà)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-gray-300 rounded-xs disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 border border-gray-300 rounded-xs disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm Mới / Chỉnh Sửa Quà Tặng (Nhập hàng mới) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white max-w-xl w-full p-6 sm:p-8 rounded-xs shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 uppercase">
                {editingProduct ? 'Chỉnh Sửa Thông Tin Quà Tặng' : 'Nhập Hàng Quà Tặng Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Tên món quà / combo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Set Quà Cưới Song Hỷ Uyên Ương"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Hình thức quà:</label>
                  <select
                    value={formData.giftType}
                    onChange={(e) => setFormData({ ...formData, giftType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs bg-white cursor-pointer"
                  >
                    <option value="combo">🎁 Quà Combo (Hộp quà)</option>
                    <option value="single">✨ Quà Lẻ (Từng món độc lập)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Danh mục:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = categories.find(c => c.slug === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryName: cat ? cat.name : 'Hộp Quà & Combo'
                      });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-xs bg-white cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dịp tặng quà */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Dịp sự kiện phù hợp (Chọn nhiều):</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {occasions.filter(o => o.id !== 'all').map(occ => (
                    <label key={occ.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.occasions.includes(occ.id)}
                        onChange={() => handleOccasionToggle(occ.id)}
                        className="accent-[#8A5B36]"
                      />
                      <span>{occ.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chi tiết bên trong nếu là Quà Combo */}
              {formData.giftType === 'combo' && (
                <div>
                  <label className="font-bold text-amber-900 block mb-1">
                    Các món đồ bên trong hộp combo (cách nhau dấu phẩy):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Ly pha lê, Nến thơm hoa hồng, Trà thảo mộc, Thiệp chúc mừng"
                    value={formData.comboItemsText}
                    onChange={(e) => setFormData({ ...formData, comboItemsText: e.target.value })}
                    className="w-full p-2 border border-amber-300 rounded-xs bg-amber-50/40"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Giá bán (VNĐ):</label>
                  <input
                    type="number"
                    required
                    placeholder="680000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Giá gốc (niêm yết):</label>
                  <input
                    type="number"
                    placeholder="790000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs"
                  />
                </div>
              </div>

              {/* Nhập số lượng tồn & đã bán (Song song) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Số lượng tồn kho:</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Đã bán được:</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.soldCount}
                    onChange={(e) => setFormData({ ...formData, soldCount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mã SKU:</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Link ảnh sản phẩm:</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8A5B36] hover:bg-[#724A2B] text-white font-bold rounded-xs transition-colors"
                >
                  {editingProduct ? 'Lưu Thay Đổi' : 'Xác Nhận Nhập Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsView;
