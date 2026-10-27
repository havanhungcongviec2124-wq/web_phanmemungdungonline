import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Dữ liệu từ Backend MongoDB
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('luxe_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // 2. Giỏ hàng & Danh sách yêu thích (Lưu localStorage)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('luxe_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('luxe_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // 3. Tải dữ liệu ban đầu từ Backend MongoDB
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, vouchRes, ordRes] = await Promise.all([
        api.getProducts().catch(() => ({ products: [] })),
        api.getCategories().catch(() => ({ categories: [] })),
        api.getVouchers().catch(() => ({ vouchers: [] })),
        api.getOrders().catch(() => ({ orders: [] })),
      ]);

      if (prodRes?.products) {
        setProducts(prodRes.products);
      }
      if (catRes?.categories) {
        setCategories(catRes.categories);
      }
      if (vouchRes?.vouchers) {
        setVouchers(vouchRes.vouchers);
      }
      if (ordRes?.orders) {
        setOrders(ordRes.orders);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ Backend:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Kiểm tra token và lấy thông tin user
  useEffect(() => {
    const token = localStorage.getItem('luxe_token');
    if (token && !currentUser) {
      api.getProfile()
        .then((res) => {
          if (res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('luxe_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('luxe_token');
          localStorage.removeItem('luxe_user');
          setCurrentUser(null);
        });
    }
  }, [currentUser]);

  // Đồng bộ giỏ hàng & yêu thích vào localStorage
  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Auth Functions
  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.token) {
      localStorage.setItem('luxe_token', res.token);
      localStorage.setItem('luxe_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
      showToast(`Đăng nhập thành công! Chào ${res.user.fullName}`);
      // Tải lại đơn hàng của user
      api.getOrders().then(o => o.orders && setOrders(o.orders)).catch(() => {});
      return res;
    }
  };

  const register = async (fullName, email, password, phone) => {
    const res = await api.register(fullName, email, password, phone);
    if (res.token) {
      localStorage.setItem('luxe_token', res.token);
      localStorage.setItem('luxe_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
      showToast('Đăng ký tài khoản thành công!');
      return res;
    }
  };

  const demoLogin = async (role = 'customer') => {
    const res = await api.demoLogin(role);
    if (res.token) {
      localStorage.setItem('luxe_token', res.token);
      localStorage.setItem('luxe_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
      showToast(`Đã đăng nhập tài khoản Demo (${role})`);
      api.getOrders().then(o => o.orders && setOrders(o.orders)).catch(() => {});
      return res;
    }
  };

  const logout = () => {
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_user');
    setCurrentUser(null);
    showToast('Đã đăng xuất tài khoản', 'info');
  };

  // Thêm vào giỏ
  const addToCart = (product, { size = 'M', color = 'Be', quantity = 1 } = {}) => {
    const pId = product._id || product.id;
    const pImg = product.images?.[0] || '';

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === pId && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: pId,
            productId: pId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            color: color,
            size: size,
            quantity: quantity,
            image: pImg,
            categoryName: product.categoryName,
          },
        ];
      }
    });

    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
    setIsCartDrawerOpen(true);
  };

  // Cập nhật số lượng
  const updateQuantity = (index, delta) => {
    setCartItems(prev => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty <= 0) {
        return next.filter((_, idx) => idx !== index);
      }
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  // Xóa toàn bộ giỏ
  const clearCart = () => {
    setCartItems([]);
    setAppliedVoucher(null);
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    const id = String(productId);
    setWishlist(prev => {
      if (prev.includes(id)) {
        showToast('Đã bỏ thích sản phẩm', 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast('Đã lưu sản phẩm vào danh sách yêu thích');
        return [...prev, id];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(String(productId));

  // Tính toán tiền
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = (subtotal >= 1000000 || appliedVoucher?.isShipping || cartItems.length === 0) ? 0 : 35000;

  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.isShipping) {
      discountAmount = 35000;
    } else {
      const raw = Math.round((subtotal * appliedVoucher.discount) / 100);
      discountAmount = appliedVoucher.maxDiscount ? Math.min(raw, appliedVoucher.maxDiscount) : raw;
    }
  }

  const total = Math.max(0, subtotal + shippingFee - (appliedVoucher?.isShipping ? 0 : discountAmount));

  // Áp dụng voucher qua Backend API
  const applyVoucher = async (code) => {
    try {
      const res = await api.validateVoucher(code, subtotal);
      if (res.success && res.voucher) {
        setAppliedVoucher(res.voucher);
        showToast(res.message);
        return true;
      }
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Đã hủy mã giảm giá', 'info');
  };

  // Tạo đơn hàng kết nối Backend MongoDB
  const createOrder = async (orderData) => {
    try {
      const payload = {
        customerInfo: orderData.shippingInfo,
        items: cartItems.map(item => ({
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          image: item.image,
          categoryName: item.categoryName,
        })),
        subtotal,
        shippingFee,
        discountAmount,
        voucherCode: appliedVoucher?.code || '',
        total,
        paymentMethod: orderData.paymentMethod || 'Chuyển khoản VietQR',
      };

      const res = await api.createOrder(payload);
      if (res.success && res.order) {
        setOrders(prev => [res.order, ...prev]);
        clearCart();
        showToast('Đặt hàng thành công và đã lưu vào hệ thống!');
        return res.order;
      }
    } catch (err) {
      showToast(`Lỗi khi đặt hàng: ${err.message}`, 'error');
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        products,
        categories,
        vouchers,
        loading,
        loadInitialData,
        currentUser,
        login,
        register,
        demoLogin,
        logout,
        cartItems,
        totalItemsCount,
        subtotal,
        shippingFee,
        discountAmount,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        orders,
        setOrders,
        createOrder,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
