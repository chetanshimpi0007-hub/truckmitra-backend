// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, ForgotPasswordRequest, LoginRequest, OtpRequest, OtpVerificationRequest, RegisterRequest, ResetPasswordRequest } from '../interfaces/auth.interface';
import authService from '../services/api/auth.service';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpMobile: string | null;
  otpExpiry: number | null;
   resetEmail: string | null;  // Add this for forgot password
}

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

const getAuthStatus = () => {
  const token = localStorage.getItem('accessToken');
  return !!token && token !== 'undefined' && token !== 'null';
};

const initialState: AuthState = {
  user: getStoredUser(),
  isAuthenticated: getAuthStatus(),
  isLoading: false,
  error: null,
  otpSent: false,
  otpMobile: null,
  otpExpiry: null,
  resetEmail: null,
};

// Helper to extract error message
const extractErrorMessage = (error: any, defaultMessage: string) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    (typeof error.response?.data === 'string' ? error.response.data : null) ||
    error.message ||
    defaultMessage
  );
};

// Async thunks
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (data: OtpRequest, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      if (response.success) {
        return { email: data.email, message: response.message };
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Add resetPassword thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Registration failed');
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Registration failed. Please try again.'));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Login failed. Please check your credentials.'));
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async ({ googleToken, deviceToken }: { googleToken: string; deviceToken?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithGoogle(googleToken, deviceToken);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Google login failed');
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Google login failed'));
    }
  }
);

export const loginWithFacebook = createAsyncThunk(
  'auth/loginWithFacebook',
  async ({ facebookToken, deviceToken }: { facebookToken: string; deviceToken?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithFacebook(facebookToken, deviceToken);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Facebook login failed');
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Facebook login failed'));
    }
  }
);

export const verifyOtpAndLogin = createAsyncThunk(
  'auth/verifyOtpAndLogin',
  async ({ data, deviceToken }: { data: OtpVerificationRequest; deviceToken?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtpAndLogin(data, deviceToken);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpMobile = null;
      state.otpExpiry = null;
      state.resetEmail = null; 
    },
    updateUser: (state, action: PayloadAction<Partial<AuthResponse>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.otpMobile = action.payload.mobile;
        state.otpExpiry = action.payload.expirySeconds;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // ✅ NEW: Facebook Login cases
      .addCase(loginWithFacebook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithFacebook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginWithFacebook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Verify OTP
      .addCase(verifyOtpAndLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpAndLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.otpSent = false;
        localStorage.setItem('accessToken', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(verifyOtpAndLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.otpMobile = null;
        state.otpExpiry = null;
      })
        // Forgot Password
    .addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.otpSent = true;
      state.resetEmail = action.payload.email;  // Store email for reset
      state.otpExpiry = 300; // 5 minutes in seconds
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    // Reset Password
    .addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.otpSent = false;
      state.resetEmail = null;
      
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload));
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, resetOtpState, updateUser } = authSlice.actions;
export default authSlice.reducer;