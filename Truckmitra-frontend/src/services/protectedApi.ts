import axios from 'axios';

const API_URL = "http://localhost:8080/api";
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  // Support both new ('accessToken') and legacy ('token') storage keys
  const token = localStorage.getItem('accessToken') ?? localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // logout
  // clear both keys to be safe
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;