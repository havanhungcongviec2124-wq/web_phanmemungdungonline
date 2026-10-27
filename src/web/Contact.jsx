import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/ui/uiSlice';

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Tư vấn chọn size & phối đồ',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    dispatch(showToast({ message: 'Tin nhắn của bạn đã được gửi thành công!', type: 'success' }));
    setFormData({ name: '', email: '', phone: '', subject: 'Tư vấn chọn size & phối đồ', message: '' });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-16 text-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.25em] text-[#8A5B36] uppercase">
            HỆ THỐNG SHOWROOM & HỖ TRỢ
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900">
            Liên Hệ Với LUXE STORE
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            Đội ngũ tư vấn phong cách của LUXE luôn sẵn sàng lắng nghe và đồng hành cùng quý khách từ 8:30 đến 22:00 hàng ngày.
          </p>
        </div>

        {/* 3 Showrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-[#ECE7DF] space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-[#8A5B36] uppercase">FLAGSHIP STORE</span>
            <h3 className="text-base font-serif font-semibold text-gray-900">LUXE TP. Hồ Chí Minh</h3>
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
              68 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. HCM
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <Phone size={14} className="text-gray-400 shrink-0" />
              (028) 3822 6868
            </p>
          </div>

          <div className="bg-white p-6 border border-[#ECE7DF] space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-[#8A5B36] uppercase">BOUTIQUE STORE</span>
            <h3 className="text-base font-serif font-semibold text-gray-900">LUXE Hà Nội</h3>
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
              12 Phố Tràng Tiền, Quận Hoàn Kiếm, Hà Nội
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <Phone size={14} className="text-gray-400 shrink-0" />
              (024) 3936 8888
            </p>
          </div>

          <div className="bg-white p-6 border border-[#ECE7DF] space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-[#8A5B36] uppercase">CONCEPT STORE</span>
            <h3 className="text-base font-serif font-semibold text-gray-900">LUXE Đà Nẵng</h3>
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
              214 Đường Bạch Đằng, Quận Hải Châu, Đà Nẵng
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-2">
              <Phone size={14} className="text-gray-400 shrink-0" />
              (0236) 3888 686
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-white border border-[#ECE7DF] p-8 shadow-sm">
          <h2 className="text-lg font-serif text-gray-900 mb-6 text-center">Gửi Lời Nhắn Cho Chúng Tôi</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912 345 678"
                  className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Chủ đề cần hỗ trợ</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black"
              >
                <option value="Tư vấn chọn size & phối đồ">Tư vấn chọn size & phối đồ</option>
                <option value="Hỏi về tiến độ đơn hàng">Hỏi về tiến độ đơn hàng</option>
                <option value="Đổi hàng / Trả hàng">Đổi hàng / Trả hàng</option>
                <option value="Hợp tác kinh doanh">Hợp tác kinh doanh</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Nội dung tin nhắn *</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Nhập nội dung cần tư vấn chi tiết tại đây..."
                className="w-full p-2.5 border border-gray-300 focus:outline-hidden focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Send size={14} /> Gửi Tin Nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
