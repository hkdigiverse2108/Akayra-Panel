import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from './context/ThemeContext';

// Core Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// User Management
import UserManagement from './pages/UserManagement';
import UserForm from './pages/UserForm';

// Category & Brand Management
import CategoryManagement from './pages/CategoryManagement';
import CategoryForm from './pages/CategoryForm';
import BrandManagement from './pages/BrandManagement';
import BrandForm from './pages/BrandForm';

// Product Management
import ProductManagement from './pages/ProductManagement';
import ProductForm from './pages/ProductForm';

// Content Management
import ReviewManagement from './pages/ReviewManagement';
import ReviewForm from './pages/ReviewForm';
import BannerManagement from './pages/BannerManagement';
import BannerForm from './pages/BannerForm';
import BlogManagement from './pages/BlogManagement';
import BlogForm from './pages/BlogForm';

// Support & FAQ
import FaqManagement from './pages/FaqManagement';
import FaqForm from './pages/FaqForm';
import FaqCategoryManagement from './pages/FaqCategoryManagement';
import FaqCategoryForm from './pages/FaqCategoryForm';

// Utility & Variations
import SizeManagement from './pages/SizeManagement';
import SizeForm from './pages/SizeForm';
import ColorManagement from './pages/ColorManagement';
import ColorForm from './pages/ColorForm';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { mode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#0ea5e9', // Sky-500
          borderRadius: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    >
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={mode === 'dark' ? 'dark' : 'light'}
        />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* User Management */}
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/add" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />

            {/* Product Management */}
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />

            {/* Category Management */}
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/categories/add" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />

            {/* Brand Management */}
            <Route path="/brands" element={<BrandManagement />} />
            <Route path="/brands/add" element={<BrandForm />} />
            <Route path="/brands/edit/:id" element={<BrandForm />} />

            {/* Content Management */}
            <Route path="/reviews" element={<ReviewManagement />} />
            <Route path="/reviews/add" element={<ReviewForm />} />
            <Route path="/reviews/edit/:id" element={<ReviewForm />} />

            <Route path="/banners" element={<BannerManagement />} />
            <Route path="/banners/add" element={<BannerForm />} />
            <Route path="/banners/edit/:id" element={<BannerForm />} />

            <Route path="/blogs" element={<BlogManagement />} />
            <Route path="/blogs/add" element={<BlogForm />} />
            <Route path="/blogs/edit/:id" element={<BlogForm />} />

            {/* Support & FAQ */}
            <Route path="/faqs" element={<FaqManagement />} />
            <Route path="/faqs/add" element={<FaqForm />} />
            <Route path="/faqs/edit/:id" element={<FaqForm />} />

            <Route path="/faq-categories" element={<FaqCategoryManagement />} />
            <Route path="/faq-categories/add" element={<FaqCategoryForm />} />
            <Route path="/faq-categories/edit/:id" element={<FaqCategoryForm />} />

            {/* Size & Color Variations */}
            <Route path="/sizes" element={<SizeManagement />} />
            <Route path="/sizes/add" element={<SizeForm />} />
            <Route path="/sizes/edit/:id" element={<SizeForm />} />

            <Route path="/colors" element={<ColorManagement />} />
            <Route path="/colors/add" element={<ColorForm />} />
            <Route path="/colors/edit/:id" element={<ColorForm />} />

            {/* General Management (Placeholders for now) */}
            <Route path="/newsletter" element={<div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl min-h-[400px] flex flex-col items-center justify-center"><h2 className="text-2xl font-black mb-2">Newsletter Management</h2><p className="text-slate-500">Coming Soon: Manage email subscriptions and campaigns.</p></div>} />
            <Route path="/contact" element={<div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl min-h-[400px] flex flex-col items-center justify-center"><h2 className="text-2xl font-black mb-2">Contact Inquiries</h2><p className="text-slate-500">Coming Soon: View and respond to user messages.</p></div>} />
            <Route path="/coupons" element={<div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl min-h-[400px] flex flex-col items-center justify-center"><h2 className="text-2xl font-black mb-2">Coupon Management</h2><p className="text-slate-500">Coming Soon: Create and track discount codes.</p></div>} />
            <Route path="/policies" element={<div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl min-h-[400px] flex flex-col items-center justify-center"><h2 className="text-2xl font-black mb-2">Policy Management</h2><p className="text-slate-500">Coming Soon: Edit Privacy Policy, Terms, etc.</p></div>} />
            <Route path="/about" element={<div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl min-h-[400px] flex flex-col items-center justify-center"><h2 className="text-2xl font-black mb-2">About Us Content</h2><p className="text-slate-500">Coming Soon: Manage company profile and brand story.</p></div>} />
            <Route path="/ig-posts" element={<div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl min-h-[400px] flex flex-col items-center justify-center"><h2 className="text-2xl font-black mb-2">Instagram Posts</h2><p className="text-slate-500">Coming Soon: Link and manage IG shoppable posts.</p></div>} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen bg-slate-950 text-white font-bold text-3xl">404 - Page Not Found</div>} />
      </Routes>
    </Router>
    </ConfigProvider>
  );
}

export default App;
