import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('akayra_token');
    if (token) {
      config.headers.authorization = token;
      config.headers.userType = localStorage.getItem('akayra_user_type') || '5';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Common Handle for all APIs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    
    // Automatically handle success messages from the backend
    // Typically for POST, PUT, DELETE operations
    if (data && data.status === 200 && data.message && response.config.method !== 'get') {
      toast.success(data.message);
    }
    
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      // Automatically handle error messages from the backend
      if (data && data.message) {
        toast.error(data.message);
      }

      if (status === 401) {
        // Handle unauthorized / session expiry cases if needed
        // toast.error('Session expired. Please login again.');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
