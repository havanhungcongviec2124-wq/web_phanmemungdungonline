import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { selectToast, hideToast } from '../redux/ui/uiSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => dispatch(hideToast()), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="bg-[#18181B] text-white px-5 py-3.5 shadow-2xl flex items-center gap-3 border border-gray-700/50 min-w-[280px]">
        {toast.type === 'error' ? (
          <AlertCircle size={18} className="text-red-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info size={18} className="text-sky-400 shrink-0" />
        ) : (
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
        )}
        <span className="text-xs font-medium tracking-wide">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
