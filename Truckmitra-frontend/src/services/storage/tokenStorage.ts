// src/services/storage/tokenStorage.ts

import jwtDecode from "jwt-decode";

interface TokenData {
  exp: number;
  userId: number;
  role: string;
  sub: string;
}

export const TokenStorage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    try {
      const decoded = jwtDecode<TokenData>(accessToken);
      localStorage.setItem('userId', decoded.userId.toString());
      localStorage.setItem('userRole', decoded.role);
      localStorage.setItem('userMobile', decoded.sub);
    } catch (error) {
      console.error('Failed to decode token');
    }
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  getUserId: (): number | null => {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
  },

  getUserRole: (): string | null => {
    return localStorage.getItem('userRole');
  },

  getUserMobile: (): string | null => {
    return localStorage.getItem('userMobile');
  },

  setDeviceToken: (token: string) => {
    localStorage.setItem('deviceToken', token);
  },

  getDeviceToken: (): string | null => {
    return localStorage.getItem('deviceToken');
  },

  generateDeviceToken: (): string => {
    const token = 'device_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36));
    localStorage.setItem('deviceToken', token);
    return token;
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userMobile');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<TokenData>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }
};