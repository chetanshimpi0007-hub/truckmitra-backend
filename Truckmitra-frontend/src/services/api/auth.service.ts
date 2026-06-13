// src/services/auth.service.ts
import { ApiResponse, AuthResponse, ForgotPasswordRequest, LoginRequest, OtpRequest, OtpResponse, OtpVerificationRequest, RegisterRequest, ResetPasswordRequest } from '../../interfaces/auth.interface';
import api from './api.service';




class AuthService {
  async sendOtp(data: OtpRequest): Promise<ApiResponse<OtpResponse>> {
    const response = await api.post('/auth/send-otp', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  async loginWithGoogle(googleToken: string, deviceToken?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login/google', null, {
      params: { googleToken, deviceToken }
    });
    return response.data;
  }

  async loginWithFacebook(facebookToken: string, deviceToken?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login/facebook', null, {
      params: { facebookToken, deviceToken }
    });
    return response.data;
  }

  async generateOtp(data: OtpRequest): Promise<ApiResponse<string>> {
    const response = await api.post('/auth/otp/generate', data);
    return response.data;
  }

  async verifyOtpAndLogin(data: OtpVerificationRequest, deviceToken?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/otp/verify', data, {
      params: { deviceToken }
    });
    return response.data;
  }


   async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }

  async logout(): Promise<void> {
    // Agar api instance handle nahi kar raha toh manually token bhejein:
    const token = localStorage.getItem('accessToken');
    await api.post('/auth/logout', null, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}

  async validateToken(): Promise<ApiResponse<boolean>> {
    const response = await api.get('/auth/validate-token');
    return response.data;
  }
}

export default new AuthService();