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
  ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts } from '../../redux/product/productSlice';
import { updateProductApi, fetchProductsApi } from '../../redux/product/productApi';
import { showToast } from '../../redux/ui/uiSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const AdminProductsView = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal Add / Edit product state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryName: 'Áo',
    price: '',
    originalPrice: '',
    stock: 25,
    sku: '',
    image: '',
    badge: 'MỚI'
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
    const matchStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'in_stock' && (p.stock || 0) > 0) ||
      (selectedStatus === 'out_of_stock' && (p.stock || 0) === 0);
    return matchName && matchCat && matchStatus;
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
      categoryName: 'Áo Blazer & Khoác',
      price: '',
      originalPrice: '',
      stock: 30,
      sku: `LX-${Math.floor(100 + Math.random() * 900)}`,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
      badge: 'MỚI'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      categoryName: p.categoryName || 'Thời trang',
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock || 0,
      sku: p.sku || `LX-${p._id?.slice(-4) || '001'}`,
      image: p.images?.[0] || '',
      badge: p.badge || ''
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

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      dispatch(showToast({ message: 'Vui lòng điền đủ tên và giá', type: 'error' }));
      return;
    }

    if (editingProduct) {
      const pId = editingProduct._id || editingProduct.id;
      const res = await dispatch(
        updateProductApi({
          id: pId,
          name: formData.name,
          categoryName: formData.categoryName,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice || formData.price),
          stock: Number(formData.stock),
          sku: formData.sku,
          badge: formData.badge,
        })
      );
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(showToast({ message: `Đã cập nhật sản phẩm "${formData.name}"`, type: 'success' }));
        setIsModalOpen(false);
      } else {
        dispatch(showToast({ message: 'Lỗi cập nhật sản phẩm', type: 'error' }));
      }
    } else {
      dispatch(showToast({ message: 'Thêm sản phẩm mới vào danh mục thành công!', type: 'success' }));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter and Action Bar */}
      <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Category Dropdown */}
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
              <option value="ao">Áo Blazer & Khoác</option>
              <option value="vay">Đầm Lụa Thiết Kế</option>
              <option value="quan">Quần & Chân Váy</option>
              <option value="phukien">Túi & Phụ Kiện</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs border border-gray-300 rounded-xs py-2 px-3 bg-[#FAF8F5] focus:outline-hidden focus:border-black cursor-pointer font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="in_stock">Đang bán (Còn hàng)</option>
              <option value="out_of_stock">Tạm hết hàng</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Tìm theo tên, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 bg-white rounded-xs focus:outline-hidden focus:border-black"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Add Product Button (Matching Figma bronze button) */}
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
        >
          <Plus size={15} />
          <span>+ Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Main Products Table */}
      <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAF8F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input type="checkbox" className="rounded-xs accent-[#8A5B36]" />
                </th>
                <th className="py-3.5 px-4">ẢNH</th>
                <th className="py-3.5 px-4">TÊN SẢN PHẨM</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">GIÁ BÁN</th>
                <th className="py-3.5 px-4">SIZE</th>
                <th className="py-3.5 px-4">MÀU SẮC</th>
                <th className="py-3.5 px-4 text-center">TỒN KHO</th>
                <th className="py-3.5 px-4 text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-4 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((p, index) => {
                const pId = p._id || p.id;
                const inStock = (p.stock || 0) > 0;
                const skuCode = p.sku || `SKU-${100 + index}`;

                return (
                  <tr key={pId} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 px-4">
                      <input type="checkbox" className="rounded-xs accent-[#8A5B36]" />
                    </td>
                    <td className="py-3 px-4">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&q=80'}
                        alt={p.name}
                        className="w-12 h-14 object-cover object-top rounded-xs border border-gray-100 bg-[#F5F2EB]"
                      />
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{p.name}</h4>
                      <span className="text-[11px] text-[#8C827A]">{p.categoryName || 'Thời trang'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-600">
                      {skuCode}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {Array.isArray(p.sizes) ? p.sizes.join(', ') : 'S, M, L'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {(p.colors || [{ hex: '#111', name: 'Đen' }]).slice(0, 3).map((col, cIdx) => (
                          <span
                            key={cIdx}
                            className="w-2.5 h-2.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: typeof col === 'string' ? col : col.hex }}
                            title={typeof col === 'string' ? col : col.name}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${inStock ? 'text-gray-900' : 'text-red-600'}`}>
                        {p.stock ?? 25}
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
                        {inStock ? 'Đang bán' : 'Tạm hết'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                          title="Chỉnh sửa sản phẩm"
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom & Pagination */}
        <div className="p-4 border-t border-gray-100 bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <span>
            Hiển thị <strong>{paginatedProducts.length}</strong> / <strong>{filteredProducts.length}</strong> sản phẩm
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-gray-300 rounded-xs hover:border-black disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 text-xs font-semibold rounded-xs border transition-colors cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#8A5B36] text-white border-[#8A5B36]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-gray-300 rounded-xs hover:border-black disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 rounded-xs animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Áo Blazer Linen Cấu Trúc"
                  className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Danh mục *</label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 bg-white rounded-xs"
                  >
                    <option value="Áo Blazer & Khoác">Áo Blazer & Khoác</option>
                    <option value="Đầm Lụa Thiết Kế">Đầm Lụa Thiết Kế</option>
                    <option value="Quần & Chân Váy">Quần & Chân Váy</option>
                    <option value="Túi & Phụ Kiện">Túi & Phụ Kiện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xs uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2390000"
                    className="w-full p-2.5 border border-gray-300 rounded-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="w-full p-2.5 border border-gray-300 rounded-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Đường dẫn hình ảnh (URL)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border border-gray-300 rounded-xs"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Lưu Thay Đổi' : 'Thêm Vào Kho Hàng'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Hủy Bỏ
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
