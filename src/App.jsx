
// src/App.js
// The main application component that sets up routing for all pages and dashboards.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import MainLayout from './components/MainLayout';
import DashboardLayout from './pages/shopOwner/DashboardLayout';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ShopsPage from './pages/ShopsPage';
import MarketsPage from './pages/MarketsPage';
import ContributePage from './pages/ContributePage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShopDetailsPage from './pages/ShopDetailsPage';
import MarketDetailsPage from './pages/MarketDetailsPage';
import MyAccountPage from './pages/MyAccountPage';
import ShopApplicationPage from './pages/ShopApplicationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Dashboard Page Components
import DashboardOverviewPage from './pages/shopOwner/DashboardOverviewPage';
import DashboardProductsPage from './pages/shopOwner/DashboardProductsPage';
import DashboardSettingsPage from './pages/shopOwner/DashboardSettingsPage';
import AddEditProductPage from './pages/shopOwner/AddEditProductPage';

// Admin Page Components
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageShopsPage from './pages/admin/ManageShopsPage';
import VerificationQueuePage from './pages/admin/VerificationQueuePage';
import ManageMarketsPage from './pages/admin/ManageMarketsPage';
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';

// Placeholder pages for routing
const About = () => <div className="text-center p-10 text-2xl">About Us</div>;
const Privacy = () => <div className="text-center p-10 text-2xl">Privacy Policy</div>;
const Contact = () => <div className="text-center p-10 text-2xl">Contact Us</div>;
const AdminSettings = () => <div className="text-center p-10 text-2xl">Admin Settings Page</div>;


export default function App() {
  return (
    <Router>
      <div className="font-sans bg-gray-50">
        <Routes>
          {/* Public-facing routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/market/:marketName" element={<MarketDetailsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-account" element={<MyAccountPage />} />
              <Route path="/contribute" element={<ContributePage />} />
              <Route path="/apply-to-sell" element={<ShopApplicationPage />} />
            </Route>
          </Route>

          {/* Protected Shop Owner Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['shopOwner', 'admin']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<DashboardOverviewPage />} />
              <Route path="products" element={<DashboardProductsPage />} />
              <Route path="settings" element={<DashboardSettingsPage />} />
              <Route path="add-product" element={<AddEditProductPage />} />
              <Route path="edit-product/:id" element={<AddEditProductPage />} />
            </Route>
          </Route>

          {/* Protected Admin Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="manage-shops" element={<ManageShopsPage />} />
              <Route path="verification-queue" element={<VerificationQueuePage />} />
              <Route path="manage-markets" element={<ManageMarketsPage />} />
              <Route path="manage-categories" element={<ManageCategoriesPage />} />
              <Route path="manage-users" element={<ManageUsersPage />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
