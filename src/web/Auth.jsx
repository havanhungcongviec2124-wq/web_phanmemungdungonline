import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginApi, registerApi } from '../redux/Auth/authApi';
import { selectAuthLoading, selectAuthError, clearAuthError } from '../redux/Auth/authSlice';
import { showToast } from '../redux/ui/uiSlice';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (isLogin) {
      const result = await dispatch(loginApi({ email, password }));
      if (loginApi.fulfilled.match(result)) {
        dispatch(showToast({ message: `Đăng nhập thành công! Chào ${result.payload.user?.fullName}` }));
        const role = result.payload.user?.role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        dispatch(showToast({ message: result.payload || 'Đăng nhập thất bại', type: 'error' }));
      }
    } else {
      const result = await dispatch(registerApi({ fullName: name, email, password, phone }));
      if (registerApi.fulfilled.match(result)) {
        dispatch(showToast({ message: 'Đăng ký tài khoản thành công!' }));
        const role = result.payload.user?.role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        dispatch(showToast({ message: result.payload || 'Đăng ký thất bại', type: 'error' }));
      }
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[#ECE7DF] p-8 sm:p-10 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="text-2xl font-bold tracking-[0.25em] text-[#18181B] font-serif uppercase">
              LUXE<span className="font-light text-[#8A5B36] ml-1">STORE</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            {isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tạo tài khoản thành viên mới'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              !isLogin ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Error banner */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 focus:outline-none focus:border-black"
                />
                <User size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 focus:outline-none focus:border-black"
                />
                <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 focus:outline-none focus:border-black"
              />
              <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Mật khẩu</label>
              {isLogin && (
                <a href="#forgot" className="text-[11px] text-[#8A5B36] hover:underline">
                  Quên mật khẩu?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs border border-gray-300 focus:outline-none focus:border-black"
              />
              <Lock size={15} className="absolute left-3 top-3 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-black"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 bg-[#18181B] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold transition-colors mt-2 disabled:opacity-50"
          >
            {authLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">Hoặc tiếp tục với</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Social auth */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              dispatch(showToast({ message: 'Đăng nhập Google thành công!' }));
              navigate('/home');
            }}
            className="py-2.5 px-3 border border-gray-300 hover:border-black text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <span className="font-bold text-red-500">G</span> Google
          </button>
          <button
            onClick={() => {
              dispatch(showToast({ message: 'Đăng nhập Apple thành công!' }));
              navigate('/home');
            }}
            className="py-2.5 px-3 border border-gray-300 hover:border-black text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <span className="font-bold text-black"></span> Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
