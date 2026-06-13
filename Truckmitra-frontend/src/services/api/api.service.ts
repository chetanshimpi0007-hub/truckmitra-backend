// src/services/api.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { ApiResponse, AuthResponse, OtpVerificationRequest } from '../../interfaces/auth.interface';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Skip token refresh for auth endpoints to avoid loops
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.data.token);
              localStorage.setItem('refreshToken', response.data.refreshToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              }
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Clear stale tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/refresh-token', {}, {
      headers: { 'Refresh-Token': refreshToken }
    });
    return response.data;
  }
  async loginWithGoogle(googleToken: string, deviceToken?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/login/google', null, {
      params: { googleToken, deviceToken }
    });
    return response.data;
  }

  async loginWithFacebook(facebookToken: string, deviceToken?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/login/facebook', null, {
      params: { facebookToken, deviceToken }
    });
    return response.data;
  }
  // api.service.ts mein ek method add karein jo hum logout ke waqt call karenge
public clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  // Axios default header reset karein
  delete this.api.defaults.headers.common['Authorization'];
}

  async verifyOtpAndLogin(data: OtpVerificationRequest, deviceToken?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/otp/verify', data, {
      params: { deviceToken }
    });
    return response.data;
  }

  getApi() {
    return this.api;
  }
}

export default new ApiService().getApi();


