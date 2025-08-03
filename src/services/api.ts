// src/services/api.ts
import axios from 'axios';
import { Paths } from '@/paths';
import { authHeader } from '../utils/authHeader';

const api = axios.create({
  baseURL: Paths.BASE_URL,
  timeout: 10000,
  // ❌ لا تضع headers هنا
});

api.interceptors.request.use(config => {
  const customHeaders = authHeader();

  // ✅ تحقق من أن config.headers موجود
  const headers = { ...(config.headers || {}) };

  // ✅ إذا البيانات FormData، لا تُضف Content-Type
  if (config.data instanceof FormData) {
    // احذف Content-Type من الـ headers المخصصة إذا وُجد
    delete customHeaders['Content-Type'];
    // أو اتركه يُدار تلقائيًا
  }

  // ✅ دمج الـ headers
  config.headers = {
    ...headers,
    ...customHeaders,
  };

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;