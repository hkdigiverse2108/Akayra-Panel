import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import PrivateRoutes from "./PrivateRoutes";
import { ROUTES } from "../Constants";

// Lazy Load Pages
const Login = lazy(() => import("../Pages/Login"));
const ForgotPassword = lazy(() => import("../Pages/ForgotPassword"));
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

//contact inquiry 
const ContactManagement = lazy(() => import("../Pages/ContactManagement"));
const NewsletterManagement = lazy(() => import("../Pages/NewsletterManagement"));

//Coupons
const CouponManagement = lazy(() => import("../Pages/CouponManagement"));
const CouponForm = lazy(() => import("../Pages/CouponForm"));

// IG Posts
const IgPostManagement = lazy(() => import("../Pages/IgPostManagement"));
const IgPostForm = lazy(() => import("../Pages/IgPostForm"));

// About Management
const AboutManagement = lazy(() => import("../Pages/AboutManagement"));
const AboutForm = lazy(() => import("../Pages/AboutForm"));

//Policy Management
const PolicyMangement = lazy(() => import("../Pages/PolicyMangement"));
const SettingsManagement = lazy(() => import("../Pages/SettingsManagement"));

//Profile
const Profile = lazy(() => import("../Pages/Profile"));

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
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

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

          {/*Contact Inquiries*/}
          <Route path={ROUTES.CONTACT} element={<ContactManagement />} />
          <Route path={ROUTES.NEWSLETTER} element={<NewsletterManagement />} />
          <Route path={ROUTES.COUPONS} element={<CouponManagement />} />
          <Route path={`${ROUTES.COUPONS}/add`} element={<CouponForm />} />
          <Route path={`${ROUTES.COUPONS}/edit/:id`} element={<CouponForm />} />

          {/* IG Posts */}
          <Route path={ROUTES.IG_POSTS} element={<IgPostManagement />} />
          <Route path={`${ROUTES.IG_POSTS}/add`} element={<IgPostForm />} />
          <Route path={`${ROUTES.IG_POSTS}/edit/:id`} element={<IgPostForm />} />

          {/* About Management */}
          <Route path={ROUTES.ABOUT} element={<AboutManagement />} />
          <Route path={`${ROUTES.ABOUT}/add`} element={<AboutForm />} />
          <Route path={`${ROUTES.ABOUT}/edit/:id`} element={<AboutForm />} />

          {/* Policy Management */}
          <Route path={ROUTES.POLICIES} element={<PolicyMangement />} />
          <Route path={`${ROUTES.POLICIES}/edit/:id`} element={<PolicyMangement />} />

          {/* Settings */}
          <Route path={ROUTES.SETTINGS} element={<SettingsManagement />} />

          {/*profile*/}
          <Route path={ROUTES.PROFILE} element={<Profile />} />       
        </Route>
      </Route>

      {/* Catch all */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen bg-slate-950 text-white font-bold text-3xl">404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default PageRoutes;
