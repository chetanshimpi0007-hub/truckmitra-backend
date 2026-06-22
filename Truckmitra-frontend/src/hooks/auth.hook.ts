// src/hooks/auth.hook.ts
import { useAppSelector, useAppDispatch } from './redux.hook';
import authService from '../services/api/auth.service';
import {
  clearError,
  login,
  loginWithGoogle,
  loginWithFacebook,  // ✅ Add this
  logout,
  register,
  resetOtpState,
  sendOtp,
  updateUser,
  forgotPassword,      // Add this
  resetPassword    ,    // Add this
  verifyOtpAndLogin
} from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  RegisterRequest,
  LoginRequest,
  OtpRequest,
  OtpVerificationRequest,
  ResetPasswordRequest,
  AuthResponse
} from '../interfaces/auth.interface';
import toast from 'react-hot-toast';
import { AccountStatus } from '../interfaces/auth.interface';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, otpSent, otpMobile, otpExpiry } = useAppSelector(
    (state) => state.auth
  );
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));

  // Sync token whenever auth state changes
  useEffect(() => {
    setToken(localStorage.getItem('accessToken'));
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSendOtp = useCallback(
    async (data: OtpRequest) => {
      const result = await dispatch(sendOtp(data));
      if (sendOtp.fulfilled.match(result)) {
        toast.success('OTP sent successfully');
        return true;
      }
      return false;
    },
    [dispatch]
  );

   const handleForgotPassword = useCallback(
    async (data: { email: string }) => {
      const result = await dispatch(forgotPassword(data));
      if (forgotPassword.fulfilled.match(result)) {
        toast.success('OTP sent to your email');
        return true;
      }
      return false;
    },
    [dispatch]
  );

  const handleResetPassword = useCallback(
    async (data: { email: string; otp: string; newPassword: string }) => {
      const result = await dispatch(resetPassword(data));
      if (resetPassword.fulfilled.match(result)) {
        toast.success('Password reset successfully! You are now logged in.');
        
        // Navigate based on user status
        const userData = result.payload;
        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userData.accountStatus === AccountStatus.REGISTERED) {
          navigate('/profile');
        } else if (userData.accountStatus === AccountStatus.PENDING_VERIFICATION) {
          navigate('/pending-approval');
        } else if (userData.accountStatus === AccountStatus.VERIFIED) {
          navigate(`/${userData.role.toLowerCase()}/dashboard`);
        }
        
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      const result = await dispatch(register(data));
      if (register.fulfilled.match(result)) {
        toast.success('Registration successful!');
        navigate('/profile'); // ✅ Redirect to profile completion
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      const result = await dispatch(login(data));
      if (login.fulfilled.match(result)) {
        const userData = result.payload;

        // Show status message from backend
        if (userData.statusMessage) {
          toast.success(userData.statusMessage);
        } else {
          toast.success('Login successful!');
        }

        // Redirect based on role and account status
        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userData.accountStatus === AccountStatus.REGISTERED) {
          navigate('/profile');
        } else if (userData.accountStatus === AccountStatus.PENDING_VERIFICATION) {
          navigate('/pending-approval');
        } else if (userData.accountStatus === AccountStatus.VERIFIED) {
          navigate(`/${userData.role.toLowerCase()}/dashboard`);
        } else if (userData.accountStatus === AccountStatus.REJECTED) {
          toast.error('Your account has been rejected. Please contact support.');
        } else if (userData.accountStatus === AccountStatus.SUSPENDED) {
          toast.error('Your account is suspended. Please contact support.');
        }
        return result.payload;
      }
      return false;
    },
    [dispatch, navigate]
  );
  

 const handleGoogleLogin = useCallback(
    async (googleToken: string, deviceToken?: string) => {
      const result = await dispatch(loginWithGoogle({ googleToken, deviceToken }));
      if (loginWithGoogle.fulfilled.match(result)) {
        const userData = result.payload;
        
        if (userData.statusMessage) {
          toast.success(userData.statusMessage);
        }
        
        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userData.accountStatus === AccountStatus.REGISTERED) {
          navigate('/profile');
        } else if (userData.accountStatus === AccountStatus.PENDING_VERIFICATION) {
          navigate('/pending-approval');
        } else {
          navigate(`/${userData.role.toLowerCase()}/dashboard`);
        }
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const handleFacebookLogin = useCallback(
    async (facebookToken: string, deviceToken?: string) => {
      const result = await dispatch(loginWithFacebook({ facebookToken, deviceToken }));
      if (loginWithFacebook.fulfilled.match(result)) {
        const userData = result.payload;
        
        if (userData.statusMessage) {
          toast.success(userData.statusMessage);
        }
        
        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userData.accountStatus === AccountStatus.REGISTERED) {
          navigate('/profile');
        } else if (userData.accountStatus === AccountStatus.PENDING_VERIFICATION) {
          navigate('/pending-approval');
        } else {
          navigate(`/${userData.role.toLowerCase()}/dashboard`);
        }
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const handleVerifyOtp = useCallback(
    async (data: OtpVerificationRequest, deviceToken?: string) => {
      const result = await dispatch(verifyOtpAndLogin({ data, deviceToken }));
      if (verifyOtpAndLogin.fulfilled.match(result)) {
        const userData = result.payload;
        
        if (userData.statusMessage) {
          toast.success(userData.statusMessage);
        }
        
        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userData.accountStatus === AccountStatus.REGISTERED) {
          navigate('/profile');
        } else if (userData.accountStatus === AccountStatus.PENDING_VERIFICATION) {
          navigate('/pending-approval');
        } else {
          navigate(`/${userData.role.toLowerCase()}/dashboard`);
        }
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );


  // const handleResetPassword = useCallback(
  //   async (data: ResetPasswordRequest) => {
  //     try {
  //       const response = await authService.resetPassword(data);
  //       if (response.success) {
  //         toast.success('Password reset successfully');
  //         return true;
  //       }
  //       return false;
  //     } catch (error: any) {
  //       toast.error(error.response?.data?.message || 'Failed to reset password');
  //       return false;
  //     }
  //   },
  //   []
  // );

  const handleLogout = useCallback(async () => {
  await dispatch(logout());

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  toast.success('Logged out successfully');

  window.location.href = '/login';
}, [dispatch]);
  const resetOtp = useCallback(() => {
    dispatch(resetOtpState());
  }, [dispatch]);

  const updateUserProfile = useCallback(
    (data: Partial<NonNullable<AuthResponse>>) => {
      dispatch(updateUser(data));
    },
    [dispatch]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    otpSent,
    otpMobile,
    otpExpiry,
    sendOtp: handleSendOtp,
    register: handleRegister,
    login: handleLogin,
    loginWithGoogle: handleGoogleLogin,
    loginWithFacebook: handleFacebookLogin,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    verifyOtp: handleVerifyOtp,
    logout: handleLogout,
    resetOtp,
    updateUserProfile,
  };
};