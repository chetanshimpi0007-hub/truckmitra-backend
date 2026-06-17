// src/services/api/protectedApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Token storage helper
const TokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken') ?? localStorage.getItem('token');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },
  
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  clearTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};
// ==========================================
// 1. PUBLIC API INSTANCE (No Interceptors)
// ==========================================
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  timeout: 30000,
});

// Optional: Public API ke liye simple error logging
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🌐 Public API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
// Create protected API instance
const protectedApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add token to every request
protectedApi.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.warn('⚠️ No access token found for protected API request');
    }
    
    // Remove Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401
protectedApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = TokenStorage.getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          TokenStorage.clearTokens();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, null, {
          headers: { 'Refresh-Token': refreshToken }
        });
        
        if (response.data?.success && response.data?.data) {
          const { token, refreshToken: newRefreshToken } = response.data.data;
          
          // Store new tokens
          TokenStorage.setTokens(token, newRefreshToken);
          
          // Update Authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry original request
          return protectedApi(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        TokenStorage.clearTokens();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other error statuses
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 403:
          console.error('🚫 403 Forbidden - Access denied');
          break;
        case 404:
          console.error('🔍 404 Not Found');
          break;
        case 500:
          console.error('⚡ 500 Internal Server Error');
          break;
        default:
          console.error(`📡 HTTP ${status}:`, data?.message || 'Unknown error');
      }
    } else if (error.request) {
      console.error('🌐 Network Error - No response received');
    } else {
      console.error('⚡ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export both named and default
export { protectedApi , publicApi};
export default protectedApi;