import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProductCatalog from './pages/product-catalog';
import CheckoutExperience from './pages/checkout-experience';
import Checkout from './pages/checkout-experience/Checkout';
import OrderConfirmation from './pages/checkout-experience/OrderConfirmation';
import CustomizationStudio from './pages/customization-studio';
import IndividualProductPage from './pages/individual-product-pages';
import AccountDashboard from './pages/account-dashboard';
import WishlistPage from './pages/account-dashboard/WishlistPage';
import Homepage from './pages/homepage';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import NotAuthorized from './pages/admin/NotAuthorized';
import ProtectedRoute from './components/ui/ProtectedRoute';
import ProductsAdmin from './pages/admin/products';
import OrdersAdmin from './pages/admin/orders';
import InventoryAdmin from './pages/admin/inventory';
import AnalyticsAdmin from './pages/admin/analytics';
import UsersAdmin from './pages/admin/users';
import AdminSettings from './pages/admin/settings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/product-catalog" element={<ProductCatalog />} />
  <Route path="/checkout-experience" element={<CheckoutExperience />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/customization-studio" element={<CustomizationStudio />} />
        <Route path="/products/:id" element={<IndividualProductPage />} />
  <Route path="/account-dashboard" element={<AccountDashboard />} />
  <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="inventory" element={<InventoryAdmin />} />
          <Route path="analytics" element={<AnalyticsAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/admin/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
