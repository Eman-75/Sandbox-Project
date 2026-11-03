import axios from 'axios';

// Prefer explicit VITE_API_URL; fallback to VITE_BACKEND_URL + /api; final fallback is localhost
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '')}/api`
    : 'http://localhost:5000/api');

const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Some existing pages still call `/api/...` while this client already points at `/api`.
  // Normalize those requests to avoid accidental `/api/api/...` URLs.
  if (typeof config.url === 'string' && config.url.startsWith('/api/')) {
    config.url = config.url.slice(4);
  }
  
  // Remove Content-Type header for FormData so axios can auto-set multipart boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Add response interceptor to handle 401 errors
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

export default instance;
