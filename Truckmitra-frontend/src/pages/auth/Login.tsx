// src/pages/auth/Login.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { AccountStatus } from '../../interfaces/auth.interface';
import toast from 'react-hot-toast';
import AuthLayout from '../../Components/layouts/AuthLayout';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<'email' | 'phone' | 'google' | 'facebook'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const { login, sendOtp, verifyOtp, loginWithGoogle, loginWithFacebook, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mobile) {
      setError('Please enter mobile number');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    const success = await sendOtp({ mobile });
    if (success) {
      setOtpSent(true);
      setError('');
      toast.success('OTP sent successfully!');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    const result = await login({
      loginType: 'EMAIL_PASSWORD',
      email,
      password
    });
    
    handlePostLogin(result);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !otp) {
      setError('Please enter mobile and OTP');
      return;
    }
    
    const result = await verifyOtp({ mobile, otp });
    handlePostLogin(result);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google Success:', credentialResponse);
    try {
      const result = await loginWithGoogle(credentialResponse.credential);
      handlePostLogin(result);
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please check your Google account and try again.');
  };

  const handleFacebookLogin = async () => {
    try {
      // For development, we'll use a mock token
      const mockFacebookToken = 'mock-facebook-token';
      const result = await loginWithFacebook(mockFacebookToken);
      handlePostLogin(result);
    } catch (err) {
      setError('Facebook login failed. Please try again.');
    }
  };

const handlePostLogin = (result: any) => {
  // result is the AuthResponse object directly (token, role, accountStatus, etc.)
  if (!result) return;

  const user = result; // AuthResponse is returned directly by the hook

  console.log('Login successful - User data:', user);

  if (user.statusMessage) {
    toast.success(user.statusMessage);
  }

  // ADMIN - Always go to admin dashboard
  if (user.role === 'ADMIN') {
    navigate('/admin/dashboard');
    return;
  }

  // Navigate based on account status
  switch (user.accountStatus) {
    case AccountStatus.REGISTERED:
      toast.success('Please complete your profile to continue.');
      navigate('/profile');
      break;

    case AccountStatus.PENDING_VERIFICATION:
      toast.success('Your profile is complete and pending verification.');
      navigate('/pending-approval');
      break;

    case AccountStatus.VERIFIED:
      toast.success('Welcome back!');
      navigate(`/${user.role.toLowerCase()}/dashboard`);
      break;

    case AccountStatus.REJECTED:
      toast.error('Your account verification has been rejected. Please contact support.');
      break;

    case AccountStatus.SUSPENDED:
      toast.error('Your account has been suspended. Please contact support.');
      break;

    case AccountStatus.DELETED:
      toast.error('This account has been deleted. Please contact support.');
      break;

    default:
      toast.error('Unknown account status. Please contact support.');
  }
};

  const renderTabButtons = () => (
    <div className="grid grid-cols-4 gap-1 mb-6">
      <button
        type="button"
        className={`py-2 px-1 text-sm font-medium rounded-t-lg transition-colors ${
          loginType === 'email'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        onClick={() => {
          setLoginType('email');
          setError('');
        }}
      >
        Email
      </button>
      <button
        type="button"
        className={`py-2 px-1 text-sm font-medium rounded-t-lg transition-colors ${
          loginType === 'phone'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        onClick={() => {
          setLoginType('phone');
          setError('');
        }}
      >
        Phone
      </button>
      <button
        type="button"
        className={`py-2 px-1 text-sm font-medium rounded-t-lg transition-colors ${
          loginType === 'google'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        onClick={() => {
          setLoginType('google');
          setError('');
        }}
      >
        Google
      </button>
      <button
        type="button"
        className={`py-2 px-1 text-sm font-medium rounded-t-lg transition-colors ${
          loginType === 'facebook'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        onClick={() => {
          setLoginType('facebook');
          setError('');
        }}
      >
        Facebook
      </button>
    </div>
  );

  const renderEmailForm = () => (
    <form className="space-y-4" onSubmit={handleEmailSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in with Email'}
      </button>
    </form>
  );

  const renderPhoneForm = () => (
    <form className="space-y-4" onSubmit={handleOtpSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input
          type="tel"
          placeholder="10-digit mobile number"
          required
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={otpSent}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      {otpSent && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
          <input
            type="text"
            placeholder="6-digit OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {!otpSent ? (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify & Login'}
        </button>
      )}
    </form>
  );

  // ✅ Updated Google Form with proper settings
  const renderGoogleForm = () => (
    <div className="space-y-4">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="250"
          auto_select={false}
          itp_support={true}
        />
      </div>
      <p className="text-xs text-center text-gray-500">
        Secure login using your Google account
      </p>
    </div>
  );

  const renderFacebookForm = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleFacebookLogin}
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FaFacebook className="h-5 w-5 mr-2" />
        Continue with Facebook
      </button>
      <p className="text-xs text-center text-gray-500">
        Secure login using your Facebook account
      </p>
    </div>
  );

  return (
    <AuthLayout title="Welcome to TruckMitra" subtitle="Sign in to your account">
      <div className="bg-white">
        {renderTabButtons()}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {loginType === 'email' && renderEmailForm()}
        {loginType === 'phone' && renderPhoneForm()}
        {loginType === 'google' && renderGoogleForm()}
        {loginType === 'facebook' && renderFacebookForm()}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to TruckMitra?</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Create an account
            </Link>
            <span className="mx-2 text-gray-400">·</span>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;