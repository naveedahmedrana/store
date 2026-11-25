import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";
import SupplierPage from "./pages/SupplierPage";
import CartPage from "./pages/CartPage";
import AuthPage, { ResetPage } from "./pages/AuthPage";
import RfqPage from "./pages/RfqPage";
import SellPage from "./pages/SellPage";
import { HelpPage, LogisticsPage, NotFound, TradePage, VerifyPage } from "./pages/StaticPages";
import { MessagesPage, OrdersPage } from "./pages/AccountPages";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/supplier/:id" element={<SupplierPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPage />} />
        <Route path="/rfq" element={<RfqPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/trade-assurance" element={<TradePage />} />
        <Route path="/seller-verification" element={<VerifyPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
