import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import PrivateRoutes from "./PrivateRoutes";
import { ROUTES } from "../Constants";

// Lazy Load Pages
const Login = lazy(() => import("../Pages/Login"));
const Dashboard = lazy(() => import("../Pages/Dashboard"));

// User Management
const UserManagement = lazy(() => import("../Pages/UserManagement"));
const UserForm = lazy(() => import("../Pages/UserForm"));

// Product Management
const ProductManagement = lazy(() => import("../Pages/ProductManagement"));
const ProductForm = lazy(() => import("../Pages/ProductForm"));

// Category Management
const CategoryManagement = lazy(() => import("../Pages/CategoryManagement"));
const CategoryForm = lazy(() => import("../Pages/CategoryForm"));

// Brand Management
const BrandManagement = lazy(() => import("../Pages/BrandManagement"));
const BrandForm = lazy(() => import("../Pages/BrandForm"));

// Variations
const SizeManagement = lazy(() => import("../Pages/SizeManagement"));
const SizeForm = lazy(() => import("../Pages/SizeForm"));
const ColorManagement = lazy(() => import("../Pages/ColorManagement"));
const ColorForm = lazy(() => import("../Pages/ColorForm"));

// Content
const ReviewManagement = lazy(() => import("../Pages/ReviewManagement"));
const ReviewForm = lazy(() => import("../Pages/ReviewForm"));
const BannerManagement = lazy(() => import("../Pages/BannerManagement"));
const BannerForm = lazy(() => import("../Pages/BannerForm"));
const BlogManagement = lazy(() => import("../Pages/BlogManagement"));
const BlogForm = lazy(() => import("../Pages/BlogForm"));

// Support
const FaqManagement = lazy(() => import("../Pages/FaqManagement"));
const FaqForm = lazy(() => import("../Pages/FaqForm"));
const FaqCategoryManagement = lazy(() => import("../Pages/FaqCategoryManagement"));
const FaqCategoryForm = lazy(() => import("../Pages/FaqCategoryForm"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-4 border-slate-200 dark:border-slate-800 animate-pulse"></div>
      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-primary-500 animate-spin"></div>
    </div>
  </div>
);

const PageRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          {/* User Management */}
          <Route path={ROUTES.USERS} element={<UserManagement />} />
          <Route path={`${ROUTES.USERS}/add`} element={<UserForm />} />
          <Route path={`${ROUTES.USERS}/edit/:id`} element={<UserForm />} />

          {/* Product Management */}
          <Route path={ROUTES.PRODUCTS} element={<ProductManagement />} />
          <Route path={`${ROUTES.PRODUCTS}/add`} element={<ProductForm />} />
          <Route path={`${ROUTES.PRODUCTS}/edit/:id`} element={<ProductForm />} />

          {/* Category Management */}
          <Route path={ROUTES.CATEGORIES} element={<CategoryManagement />} />
          <Route path={`${ROUTES.CATEGORIES}/add`} element={<CategoryForm />} />
          <Route path={`${ROUTES.CATEGORIES}/edit/:id`} element={<CategoryForm />} />

          {/* Brand Management */}
          <Route path={ROUTES.BRANDS} element={<BrandManagement />} />
          <Route path={`${ROUTES.BRANDS}/add`} element={<BrandForm />} />
          <Route path={`${ROUTES.BRANDS}/edit/:id`} element={<BrandForm />} />

          {/* Content Management */}
          <Route path={ROUTES.REVIEWS} element={<ReviewManagement />} />
          <Route path={`${ROUTES.REVIEWS}/add`} element={<ReviewForm />} />
          <Route path={`${ROUTES.REVIEWS}/edit/:id`} element={<ReviewForm />} />

          <Route path={ROUTES.BANNERS} element={<BannerManagement />} />
          <Route path={`${ROUTES.BANNERS}/add`} element={<BannerForm />} />
          <Route path={`${ROUTES.BANNERS}/edit/:id`} element={<BannerForm />} />

          <Route path={ROUTES.BLOGS} element={<BlogManagement />} />
          <Route path={`${ROUTES.BLOGS}/add`} element={<BlogForm />} />
          <Route path={`${ROUTES.BLOGS}/edit/:id`} element={<BlogForm />} />

          {/* Support & FAQ */}
          <Route path={ROUTES.FAQS} element={<FaqManagement />} />
          <Route path={`${ROUTES.FAQS}/add`} element={<FaqForm />} />
          <Route path={`${ROUTES.FAQS}/edit/:id`} element={<FaqForm />} />

          <Route path={ROUTES.FAQ_CATEGORIES} element={<FaqCategoryManagement />} />
          <Route path={`${ROUTES.FAQ_CATEGORIES}/add`} element={<FaqCategoryForm />} />
          <Route path={`${ROUTES.FAQ_CATEGORIES}/edit/:id`} element={<FaqCategoryForm />} />

          {/* Size & Color Variations */}
          <Route path={ROUTES.SIZES} element={<SizeManagement />} />
          <Route path={`${ROUTES.SIZES}/add`} element={<SizeForm />} />
          <Route path={`${ROUTES.SIZES}/edit/:id`} element={<SizeForm />} />

          <Route path={ROUTES.COLORS} element={<ColorManagement />} />
          <Route path={`${ROUTES.COLORS}/add`} element={<ColorForm />} />
          <Route path={`${ROUTES.COLORS}/edit/:id`} element={<ColorForm />} />

          {/* General Management (Coming Soon placeholders) */}
          {[
            { path: ROUTES.NEWSLETTER, label: "Newsletter Management" },
            { path: ROUTES.CONTACT, label: "Contact Inquiries" },
            { path: ROUTES.COUPONS, label: "Coupon Management" },
            { path: ROUTES.POLICIES, label: "Policy Management" },
            { path: ROUTES.ABOUT, label: "About Us Content" },
            { path: ROUTES.IG_POSTS, label: "Instagram Posts" },
            { path: ROUTES.SETTINGS, label: "Account Settings" },
          ].map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl min-h-[400px] flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-black mb-2">{item.label}</h2>
                  <p className="text-slate-500">Coming Soon: Standardizing this module with TanStack Query.</p>
                </div>
              }
            />
          ))}
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<div className="flex items-center justify-center h-screen bg-slate-950 text-white font-bold text-3xl">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default PageRoutes;
