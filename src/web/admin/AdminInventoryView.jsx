import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Box,
  Flame,
  Clock,
  Sparkles,
  Tag
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts } from '../../redux/product/productSlice';
import { updateProductApi } from '../../redux/product/productApi';
import { showToast } from '../../redux/ui/uiSlice';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const AdminInventoryView = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Tính toán chỉ số kho hàng quà tặng
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalSold = products.reduce((acc, p) => acc + (Number(p.soldCount) || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.stock) || 0) * (Number(p.price) || 0), 0);
  const lowStockProducts = products.filter((p) => (Number(p.stock) || 0) < 5);
  const outOfStockProducts = products.filter((p) => (Number(p.stock) || 0) === 0);

  // Phân loại: Hàng bán nhiều (Bán chạy) vs Hàng bán chậm (Bán ít / Tồn nhiều)
  const bestSellerProducts = [...products].sort((a, b) => (Number(b.soldCount) || 0) - (Number(a.soldCount) || 0)).filter(p => (Number(p.soldCount) || 0) >= 100);
  const slowMovingProducts = products.filter(p => (Number(p.soldCount) || 0) < 50 && (Number(p.stock) || 0) >= 15);

  // Điều chỉnh tồn kho trực tiếp
  const handleAdjustStock = async (p, delta) => {
    const pId = p._id || p.id;
    const current = Number(p.stock) || 0;
    const newStock = Math.max(0, current + delta);

    const res = await dispatch(updateProductApi({ id: pId, stock: newStock }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(
        showToast({
          message: `Đã cập nhật kho (${p.name}): ${newStock} sp`,
          type: 'success',
        })
      );
    } else {
      dispatch(showToast({ message: 'Lỗi cập nhật tồn kho', type: 'error' }));
    }
  };

  const handleRestockQuick = async (p, amount = 20) => {
    const pId = p._id || p.id;
    const current = Number(p.stock) || 0;
    const newStock = current + amount;

    const res = await dispatch(updateProductApi({ id: pId, stock: newStock }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(
        showToast({
          message: `Nhập kho thành công +${amount} món quà cho "${p.name}"`,
          type: 'success',
        })
      );
    } else {
      dispatch(showToast({ message: 'Lỗi nhập kho', type: 'error' }));
    }
  };

  // Tạo khuyến mãi xả hàng cho sản phẩm bán chậm
  const handleDiscountSlowMoving = async (p) => {
    const pId = p._id || p.id;
    const discountedPrice = Math.round(Number(p.price) * 0.85);
    const res = await dispatch(
      updateProductApi({
        id: pId,
        price: discountedPrice,
        originalPrice: p.originalPrice || p.price,
        badge: 'XẢ KHO -15%'
      })
    );
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(
        showToast({
          message: `Đã áp dụng giảm giá 15% xả hàng cho "${p.name}"!`,
          type: 'success',
        })
      );
    }
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchName = (p.name || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
    const stock = Number(p.stock) || 0;
    const sold = Number(p.soldCount) || 0;

    if (filterType === 'bestseller') return matchName && sold >= 100;
    if (filterType === 'slow') return matchName && (sold < 50 && stock >= 15);
    if (filterType === 'low') return matchName && stock < 5 && stock > 0;
    if (filterType === 'out') return matchName && stock === 0;
    return matchName;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng tồn */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
              TỔNG HÀNG TỒN KHO
            </span>
            <h3 className="text-2xl font-bold text-[#18181B] mt-1.5">
              {totalStock.toLocaleString('vi-VN')} món
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Phân bổ trên {products.length} mã sản phẩm
            </p>
          </div>
          <div className="w-10 h-10 bg-[#FAF5EE] border border-[#ECE4D8] rounded-xs flex items-center justify-center text-[#8A5B36]">
            <Box size={20} />
          </div>
        </div>

        {/* Card 2: Tổng đã bán */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              TỔNG ĐÃ BÁN ĐƯỢC
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mt-1.5">
              {totalSold.toLocaleString('vi-VN')} món
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
              Tổng lượng xuất kho quà tặng
            </p>
          </div>
          <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xs flex items-center justify-center text-amber-800">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Card 3: Hàng bán chậm (Requirement 7) */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              HÀNG BÁN CHẬM (TỒN LÂU)
            </span>
            <h3 className="text-2xl font-bold text-rose-600 mt-1.5">
              {slowMovingProducts.length} mã hàng
            </h3>
            <p className="text-[11px] text-rose-500 font-medium mt-0.5">
              Cần lên khuyến mãi xả kho
            </p>
          </div>
          <div className="w-10 h-10 bg-rose-50 border border-rose-200 rounded-xs flex items-center justify-center text-rose-600">
            <Clock size={20} />
          </div>
        </div>

        {/* Card 4: Sắp hết & hết hàng */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
              CẦN NHẬP KHO GẤP
            </span>
            <h3 className="text-2xl font-bold text-red-600 mt-1.5">
              {lowStockProducts.length + outOfStockProducts.length} sản phẩm
            </h3>
            <p className="text-[11px] text-red-500 font-medium mt-0.5">
              {outOfStockProducts.length} sp đã hết, {lowStockProducts.length} sp dưới 5
            </p>
          </div>
          <div className="w-10 h-10 bg-red-50 border border-red-200 rounded-xs flex items-center justify-center text-red-600">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Inventory Table (8 cols) & Action Alerts (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Detailed Stock Table */}
        <div className="lg:col-span-8 bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            {/* Filter Tabs: Hàng bán nhiều, Bán chậm, Tồn kho */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`text-xs px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                  filterType === 'all'
                    ? 'bg-[#8A5B36] text-white'
                    : 'bg-[#FAF8F5] text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tất cả ({products.length})
              </button>
              <button
                onClick={() => setFilterType('bestseller')}
                className={`text-xs px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                  filterType === 'bestseller'
                    ? 'bg-amber-800 text-white'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Flame size={12} />
                Bán nhiều ({bestSellerProducts.length})
              </button>
              <button
                onClick={() => setFilterType('slow')}
                className={`text-xs px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                  filterType === 'slow'
                    ? 'bg-rose-700 text-white'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <Clock size={12} />
                Bán chậm ({slowMovingProducts.length})
              </button>
              <button
                onClick={() => setFilterType('low')}
                className={`text-xs px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                  filterType === 'low'
                    ? 'bg-red-700 text-white'
                    : 'bg-red-50 text-red-800 hover:bg-red-100'
                }`}
              >
                Sắp hết ({lowStockProducts.length})
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Tìm mã SKU, tên quà..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-xs bg-[#FAF8F5] focus:outline-hidden focus:border-black"
              />
              <Search size={13} className="absolute left-2.5 top-2 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-[#FAF8F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-3">SẢN PHẨM QUÀ</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3 text-center bg-amber-50/40">ĐÃ BÁN</th>
                  <th className="py-3 px-3 text-center bg-emerald-50/40">TỒN THỰC</th>
                  <th className="py-3 px-3 text-center">TỐC ĐỘ BÁN</th>
                  <th className="py-3 px-3 text-center">ĐIỀU CHỈNH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p, idx) => {
                  const stock = Number(p.stock) || 0;
                  const sold = Number(p.soldCount) || 0;
                  const isLow = stock < 5 && stock > 0;
                  const isOut = stock === 0;
                  const isBest = sold >= 100;
                  const isSlow = sold < 50 && stock >= 15;

                  return (
                    <tr key={p._id || p.id || idx} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5 max-w-[200px]">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=80&q=80'}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded-xs border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{p.name}</h4>
                            <span className="text-[10px] text-gray-500">
                              {p.giftType === 'combo' ? '🎁 Hộp Combo' : '✨ Quà Lẻ'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-gray-600">
                        {p.sku || `GIFT-${100 + idx}`}
                      </td>

                      {/* Song song: ĐÃ BÁN */}
                      <td className="py-3 px-3 text-center bg-amber-50/20 font-mono font-bold text-gray-900 text-sm">
                        {sold}
                      </td>

                      {/* Song song: TỒN THỰC */}
                      <td className="py-3 px-3 text-center bg-emerald-50/20 font-mono font-bold text-sm">
                        <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-gray-900'}>
                          {stock}
                        </span>
                      </td>

                      {/* TỐC ĐỘ BÁN: Bán chạy vs Bán chậm */}
                      <td className="py-3 px-3 text-center">
                        {isBest ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-xs bg-amber-100 text-amber-900 border border-amber-200">
                            <Flame size={11} /> Bán chạy
                          </span>
                        ) : isSlow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-xs bg-rose-100 text-rose-800 border border-rose-200">
                            <Clock size={11} /> Bán chậm
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs bg-gray-100 text-gray-700">
                            Bình thường
                          </span>
                        )}
                      </td>

                      {/* ĐIỀU CHỈNH KHO */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center border border-gray-300 rounded-xs bg-white">
                          <button
                            onClick={() => handleAdjustStock(p, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                            title="Giảm 1 sp"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-semibold text-gray-800">
                            {stock}
                          </span>
                          <button
                            onClick={() => handleAdjustStock(p, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                            title="Tăng 1 sp"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Cảnh Báo Hàng Bán Chậm & Cảnh Báo Nhập Kho */}
        <div className="lg:col-span-4 space-y-6">
          {/* Box 1: Xử lý Hàng Bán Chậm (Requirement 7) */}
          <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Clock size={16} className="text-rose-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Gợi Ý Xử Lý Hàng Bán Chậm
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              Các sản phẩm dưới đây có lượng bán thấp nhưng tồn kho còn nhiều, hãy tạo khuyến mãi để kích cầu:
            </p>

            <div className="space-y-3 pt-1">
              {slowMovingProducts.length === 0 ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xs text-center">
                  ✓ Không có mặt hàng nào bị tồn đọng bán chậm!
                </div>
              ) : (
                slowMovingProducts.slice(0, 4).map((p, idx) => (
                  <div key={p._id || idx} className="p-3 bg-[#FFFBF8] border border-[#FADCD5] rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-gray-900 truncate max-w-[160px]">
                        {p.name}
                      </h4>
                      <span className="text-[11px] font-bold text-rose-600 font-mono">
                        Tồn {p.stock} / Bán {p.soldCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-gray-900">
                        {formatCurrency(p.price)}
                      </span>
                      <button
                        onClick={() => handleDiscountSlowMoving(p)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Tag size={11} />
                        Xả kho -15%
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Box 2: Cảnh Báo Nhập Kho */}
          <div className="bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <AlertTriangle size={16} className="text-red-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Cần Nhập Thêm Hàng
              </h3>
            </div>
            <div className="space-y-2.5">
              {[...outOfStockProducts, ...lowStockProducts].slice(0, 4).map((p, idx) => (
                <div key={p._id || idx} className="p-2.5 bg-red-50/50 border border-red-200 rounded-xs flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-gray-900 truncate max-w-[140px]">{p.name}</h5>
                    <span className="text-[10px] text-red-600 font-bold">Còn {p.stock || 0} sp</span>
                  </div>
                  <button
                    onClick={() => handleRestockQuick(p, 20)}
                    className="px-2 py-1 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-[10px] font-bold rounded-xs cursor-pointer"
                  >
                    + Nhập 20 sp
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryView;
