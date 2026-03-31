import api from './api';

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  verifyOtp: (data: any) => api.post('/auth/verify-otp', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
};

export const userAPI = {
  getAll: (params?: any) => api.get('/user/all', { params }),
  getById: (id: string) => api.get(`/user/${id}`),
  add: (data: any) => api.post('/user/add', data),
  edit: (data: any) => api.put('/user/edit', data),
  delete: (id: string) => api.delete(`/user/${id}`),
};

export const categoryAPI = {
  getAll: (params?: any) => api.get('/category/all', { params }),
  getById: (id: string) => api.get(`/category/${id}`),
  add: (data: any) => api.post('/category/add', data),
  edit: (data: any) => api.put('/category/edit', data),
  delete: (id: string) => api.delete(`/category/${id}`),
};

export const brandAPI = {
  getAll: (params?: any) => api.get('/brand/all', { params }),
  getById: (id: string) => api.get(`/brand/${id}`),
  add: (data: any) => api.post('/brand/add', data),
  edit: (data: any) => api.put('/brand/edit', data),
  delete: (id: string) => api.delete(`/brand/${id}`),
};

export const sizeAPI = {
  getAll: (params?: any) => api.get('/size/all', { params }),
  getById: (id: string) => api.get(`/size/${id}`),
  add: (data: any) => api.post('/size/add', data),
  edit: (data: any) => api.put('/size/edit', data),
  delete: (id: string) => api.delete(`/size/${id}`),
};

export const colorAPI = {
  getAll: (params?: any) => api.get('/color/all', { params }),
  getById: (id: string) => api.get(`/color/${id}`),
  add: (data: any) => api.post('/color/add', data),
  edit: (data: any) => api.put('/color/edit', data),
  delete: (id: string) => api.delete(`/color/${id}`),
};

export const productAPI = {
  getAll: (params?: any) => api.get('/product/all', { params }),
  getById: (id: string) => api.get(`/product/${id}`),
  add: (data: any) => api.post('/product/add', data),
  edit: (data: any) => api.put('/product/edit', data),
  delete: (id: string) => api.delete(`/product/${id}`),
};

export const reviewAPI = {
  getAll: (params?: any) => api.get('/review/all', { params }),
  getById: (id: string) => api.get(`/review/${id}`),
  add: (data: any) => api.post('/review/add', data),
  edit: (data: any) => api.put('/review/edit', data),
  delete: (id: string) => api.delete(`/review/${id}`),
};

export const bannerAPI = {
  getAll: (params?: any) => api.get('/banner/all', { params }),
  getById: (id: string) => api.get(`/banner/${id}`),
  add: (data: any) => api.post('/banner/add', data),
  edit: (data: any) => api.put('/banner/edit', data),
  delete: (id: string) => api.delete(`/banner/${id}`),
};

export const blogAPI = {
  getAll: (params?: any) => api.get('/blog/all', { params }),
  getById: (id: string) => api.get(`/blog/${id}`),
  add: (data: any) => api.post('/blog/add', data),
  edit: (data: any) => api.put('/blog/edit', data),
  delete: (id: string) => api.delete(`/blog/${id}`),
};

export const faqCategoryAPI = {
  getAll: (params?: any) => api.get('/faq-category/all', { params }),
  getById: (id: string) => api.get(`/faq-category/${id}`),
  add: (data: any) => api.post('/faq-category/add', data),
  edit: (data: any) => api.put('/faq-category/edit', data),
  delete: (id: string) => api.delete(`/faq-category/${id}`),
};

export const faqAPI = {
  getAll: (params?: any) => api.get('/faq/all', { params }),
  getById: (id: string) => api.get(`/faq/${id}`),
  add: (data: any) => api.post('/faq/add', data),
  edit: (data: any) => api.put('/faq/edit', data),
  delete: (id: string) => api.delete(`/faq/${id}`),
};

// Export individual groups or just the whole thing
const apiMethods = {
  auth: authAPI,
  user: userAPI,
  category: categoryAPI,
  brand: brandAPI,
  size: sizeAPI,
  color: colorAPI,
  product: productAPI,
  review: reviewAPI,
  banner: bannerAPI,
  blog: blogAPI,
  faqCategory: faqCategoryAPI,
  faq: faqAPI,
};

export default apiMethods;
