// src/pages/auth/ForgotPassword.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { 
  HiCheckCircle, 
  HiClock, 
  HiRefresh,
  HiMail,
  HiLockClosed,
  HiKey,
  HiOutlineClock,
  HiShieldCheck,
  HiArrowRight,
  HiEye,
  HiEyeOff
} from 'react-icons/hi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false); // New state for OTP verification
  const [isVerifying, setIsVerifying] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP Verify, 3: New Password
  const [timer, setTimer] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const { forgotPassword, resetPassword, verifyOtp, isLoading } = useAuth();
  const navigate = useNavigate();

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timer > 180) return 'text-green-600';
    if (timer > 60) return 'text-yellow-600';
    return 'text-red-600 animate-pulse';
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (i < 6 && /^\d*$/.test(char)) {
          newOtp[i] = char;
        }
      });
      setOtp(newOtp);
      
      const lastFilledIndex = Math.min(pastedOtp.length - 1, 5);
      const nextInput = document.getElementById(`otp-${lastFilledIndex + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    } else if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    const newOtp = [...otp];
    pastedOtp.forEach((char, i) => {
      if (i < 6) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const success = await forgotPassword({ email });
    if (success) {
      setStep(2);
      setTimer(300);
      setIsActive(true);
      setError('');
    }
  };

  // New function to verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    if (timer === 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    setIsVerifying(true);
    // Here you would call your OTP verification API
    // For now, we'll simulate OTP verification
    // In real app, call your backend verify-otp endpoint
    
    // Simulate API call
    setTimeout(() => {
      // Assume OTP is valid for demo
      setOtpVerified(true);
      setStep(3);
      setIsVerifying(false);
      setError('');
    }, 1500);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Please fill all password fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const otpString = otp.join('');
    const success = await resetPassword({ 
      email, 
      otp: otpString, 
      newPassword 
    });

    if (success) {
      setSuccess(true);
      setIsActive(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  const handleResendOtp = async () => {
    const success = await forgotPassword({ email });
    if (success) {
      setTimer(300);
      setIsActive(true);
      setOtp(['', '', '', '', '', '']);
      setError('');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <HiCheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. Redirecting to login...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">Email</div>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gray-200">
              <div className={`h-full bg-indigo-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">Verify</div>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gray-200">
              <div className={`h-full bg-indigo-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">Reset</div>
            </div>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md flex items-start">
              <HiLockClosed className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {step === 1 && (
            // Step 1: Email Form
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            // Step 2: OTP Verification
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <HiKey className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verify OTP</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the 6-digit code sent to <span className="font-medium text-indigo-600">{email}</span>
                </p>
              </div>

              {/* OTP Timer */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <HiOutlineClock className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">OTP Expires in:</span>
                  </div>
                  <div className={`text-xl font-bold ${getTimerColor()}`}>
                    {formatTime(timer)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      timer > 180 ? 'bg-green-500' : timer > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(timer / 300) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* OTP Input Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter 6-digit OTP
                </label>
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none transition-all duration-150 ${
                        focusedIndex === index
                          ? 'border-indigo-500 ring-2 ring-indigo-200'
                          : digit
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-gray-300'
                      }`}
                      inputMode="numeric"
                      pattern="\d*"
                      disabled={isVerifying}
                    />
                  ))}
                </div>
              </div>

              {/* Verify OTP Button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.join('').length !== 6 || timer === 0}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
              >
                {isVerifying ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Verify OTP
                    <HiArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </button>

              {/* Resend OTP */}
              {timer === 0 ? (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    <HiRefresh className="h-4 w-4 mr-1" />
                    Resend OTP
                  </button>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  Didn't receive OTP? You can resend after timer expires
                </p>
              )}

              {/* Back to email */}
              <div className="text-center border-t pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:text-indigo-600 font-medium"
                >
                  ← Change email
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            // Step 3: New Password Form
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <HiShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">OTP Verified Successfully!</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Now set your new password
                </p>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ${
                      newPassword && confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Resetting...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link (only show on step 1) */}
          {step === 1 && (
            <div className="mt-6 text-center border-t pt-4">
              <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;