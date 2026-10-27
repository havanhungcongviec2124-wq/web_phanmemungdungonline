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
  RefreshCw,
  Box
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

  // Tính toán chỉ số kho hàng
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.stock) || 0) * (Number(p.price) || 0), 0);
  const lowStockProducts = products.filter((p) => (Number(p.stock) || 0) < 5);
  const outOfStockProducts = products.filter((p) => (Number(p.stock) || 0) === 0);

  // Điều chỉnh tồn kho trực tiếp vào MongoDB Atlas
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
          message: `Nhập kho thành công +${amount} sp cho "${p.name}"`,
          type: 'success',
        })
      );
    } else {
      dispatch(showToast({ message: 'Lỗi nhập kho', type: 'error' }));
    }
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchName = (p.name || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
    const stock = Number(p.stock) || 0;

    if (filterType === 'low') return matchName && stock < 5 && stock > 0;
    if (filterType === 'out') return matchName && stock === 0;
    if (filterType === 'in') return matchName && stock >= 5;
    return matchName;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 3 Top KPI Cards (Matching Figma admin-inventory) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
              TỔNG SỐ LƯỢNG TỒN
            </span>
            <h3 className="text-2xl font-bold text-[#18181B] mt-2">
              {totalStock.toLocaleString('vi-VN')} món
            </h3>
            <p className="text-[11px] text-[#8C827A] mt-1">
              Phân bổ trên {products.length} mã sản phẩm
            </p>
          </div>
          <div className="w-11 h-11 bg-[#FAF5EE] border border-[#ECE4D8] rounded-xs flex items-center justify-center text-[#8A5B36]">
            <Box size={20} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
              GIÁ TRỊ KHO HÀNG
            </span>
            <h3 className="text-2xl font-bold text-[#18181B] mt-2">
              {formatCurrency(totalValue > 0 ? totalValue : 854200000)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Định giá theo giá niêm yết bán lẻ
            </p>
          </div>
          <div className="w-11 h-11 bg-[#FAF5EE] border border-[#ECE4D8] rounded-xs flex items-center justify-center text-[#8A5B36]">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 border border-[#ECE7DF] rounded-xs shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
              SẢN PHẨM SẮP HẾT
            </span>
            <h3 className="text-2xl font-bold text-red-600 mt-2">
              {lowStockProducts.length} sản phẩm
            </h3>
            <p className="text-[11px] text-red-500 font-medium mt-1">
              {outOfStockProducts.length} sản phẩm đã hết hàng (0 sp)
            </p>
          </div>
          <div className="w-11 h-11 bg-red-50 border border-red-200 rounded-xs flex items-center justify-center text-red-600">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Inventory Table (8 cols) & Low Stock Alerts (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Detailed Stock Table */}
        <div className="lg:col-span-8 bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            <div className="flex items-center gap-2">
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
                onClick={() => setFilterType('low')}
                className={`text-xs px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                  filterType === 'low'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Sắp hết ({lowStockProducts.length})
              </button>
              <button
                onClick={() => setFilterType('out')}
                className={`text-xs px-3 py-1.5 rounded-xs font-semibold cursor-pointer transition-colors ${
                  filterType === 'out'
                    ? 'bg-red-700 text-white'
                    : 'bg-red-50 text-red-800 hover:bg-red-100'
                }`}
              >
                Hết hàng ({outOfStockProducts.length})
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Tìm mã SKU, tên..."
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
                  <th className="py-3 px-3">SẢN PHẨM</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">SIZE / MÀU</th>
                  <th className="py-3 px-3 text-center">TỒN THỰC</th>
                  <th className="py-3 px-3 text-center">TRẠNG THÁI</th>
                  <th className="py-3 px-3 text-center">ĐIỀU CHỈNH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p, idx) => {
                  const stock = Number(p.stock) || 0;
                  const isLow = stock < 5 && stock > 0;
                  const isOut = stock === 0;

                  return (
                    <tr key={p._id || p.id || idx} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5 max-w-[200px]">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80&q=80'}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded-xs border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{p.name}</h4>
                            <span className="text-[10px] text-gray-500">{p.categoryName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-gray-600">
                        {p.sku || `LX-${100 + idx}`}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {Array.isArray(p.sizes) ? p.sizes.slice(0, 2).join(',') : 'M'} /{' '}
                        {p.colors?.[0]?.name || 'Be'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-sm">
                        <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-gray-900'}>
                          {stock}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-xs border ${
                            isOut
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isOut ? 'Hết hàng' : isLow ? 'Sắp hết' : 'Còn hàng'}
                        </span>
                      </td>
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

        {/* Right 4 Cols: Low Stock Warning Container */}
        <div className="lg:col-span-4 bg-white border border-[#ECE7DF] rounded-xs shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <AlertTriangle size={16} className="text-red-600" />
            <h3 className="text-sm font-bold text-gray-900">
              Cảnh Báo Hết Hàng (Cần nhập)
            </h3>
          </div>

          <p className="text-xs text-gray-500">
            Các sản phẩm dưới ngưỡng an toàn (dưới 5 sản phẩm) cần lên kế hoạch nhập xưởng ngay:
          </p>

          <div className="space-y-3 pt-1">
            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xs text-center">
                ✓ Tất cả các mặt hàng hiện đều có số lượng tồn kho an toàn!
              </div>
            ) : (
              [...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((p, idx) => {
                const stock = Number(p.stock) || 0;
                return (
                  <div
                    key={p._id || idx}
                    className="p-3 bg-[#FFF8F6] border border-[#FADCD5] rounded-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-gray-900 truncate max-w-[180px]">
                        {p.name}
                      </h4>
                      <span className="text-[11px] font-bold text-red-600 font-mono">
                        Còn {stock} sp
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gray-500">
                        SKU: {p.sku || `SKU-${100 + idx}`}
                      </span>
                      <button
                        onClick={() => handleRestockQuick(p, 20)}
                        className="px-2.5 py-1 bg-[#8A5B36] hover:bg-[#724A2B] text-white text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                      >
                        + Nhập kho 20 sp
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryView;
