import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/ui/uiSlice';

const Foodter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const dispatch = useDispatch();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      dispatch(showToast({ message: 'Cảm ơn bạn đã đăng ký nhận bản tin từ LUXE STORE!', type: 'success' }));
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#121212] text-[#A1A1AA] pt-16 pb-10 border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Columns Grid (Exact Figma footer layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#27272A]">
          {/* Col 1: Brand Info & Socials */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold tracking-[0.25em] text-white font-serif uppercase">
                LUXE<span className="font-light text-[#D4AF37] ml-1">STORE</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#9CA3AF] max-w-sm">
              Thương hiệu thời trang tối giản sang trọng phong cách sống hiện đại.
              Tinh tế trong từng đường kim mũi chỉ, hướng tới vẻ đẹp thanh lịch bền vững vượt thời gian.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-[#1F1F23] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#8A5B36] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-[#1F1F23] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#8A5B36] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-full bg-[#1F1F23] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#8A5B36] transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: MUA SẮM */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5 font-sans">
              MUA SẮM
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Tất cả sản phẩm</Link>
              </li>
              <li>
                <Link to="/products?tag=bestseller" className="hover:text-white transition-colors">Bán chạy nhất</Link>
              </li>
              <li>
                <Link to="/products?tag=new" className="hover:text-white transition-colors">Hàng mới về</Link>
              </li>
              <li>
                <Link to="/products?category=ao" className="hover:text-white transition-colors">Áo Blazer & Khoác</Link>
              </li>
              <li>
                <Link to="/products?category=vay" className="hover:text-white transition-colors">Đầm Lụa Thiết Kế</Link>
              </li>
              <li>
                <Link to="/products?tag=sale" className="text-rose-400 hover:text-rose-300 transition-colors">Ưu đãi giảm giá</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: HỖ TRỢ */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5 font-sans">
              HỖ TRỢ
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Chính sách đổi trả 30 ngày</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Chính sách vận chuyển</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Hướng dẫn chọn size</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Câu hỏi thường gặp (FAQ)</Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition-colors">Hệ thống quản trị (Admin)</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: ĐĂNG KÝ NHẬN TIN */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-5 font-sans">
              ĐĂNG KÝ NHẬN TIN
            </h4>
            <p className="text-xs leading-relaxed text-[#9CA3AF] mb-4">
              Nhận thông tin cập nhật về các bộ sưu tập mới nhất và ưu đãi độc quyền sớm nhất từ LUXE.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn..."
                  className="w-full bg-[#1E1E22] border border-[#333338] text-xs text-white placeholder-gray-500 py-3 pl-3 pr-10 focus:outline-hidden focus:border-[#8A5B36] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#8A5B36] hover:bg-[#A06C42] text-white flex items-center justify-center transition-colors"
                  aria-label="Đăng ký"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1">✓ Đăng ký thành công!</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#71717A] gap-4">
          <p>© 2026 LUXE STORE. Thiết kế và bản quyền thuộc về LUXE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> Quận 1, TP. Hồ Chí Minh, Việt Nam
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={12} /> 1800 6868
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Foodter;