import { createHashRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../web/Home";
import Products from "../web/Products";
import ProductDetail from "../web/ProductDetail";
import Cart from "../web/Cart";
import Checkout from "../web/Checkout";
import Auth from "../web/Auth";
import AccountOrders from "../web/AccountOrders";
import AdminDashboard from "../web/AdminDashboard";
import Contact from "../web/Contact";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "account",
        element: <AccountOrders />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin-dashboard",
        element: <Navigate to="/admin?tab=dashboard" replace />,
      },
      {
        path: "admin-products",
        element: <Navigate to="/admin?tab=products" replace />,
      },
      {
        path: "admin-orders",
        element: <Navigate to="/admin?tab=orders" replace />,
      },
      {
        path: "admin-inventory",
        element: <Navigate to="/admin?tab=inventory" replace />,
      },
      {
        path: "admin-reports",
        element: <Navigate to="/admin?tab=reports" replace />,
      },
      {
        path: "admin/:tab",
        element: <AdminDashboard />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);

export default router;