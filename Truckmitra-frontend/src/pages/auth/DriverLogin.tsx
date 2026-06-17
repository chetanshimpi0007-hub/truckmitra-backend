import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { 
  HiMail, 
  HiLockClosed, 
  HiArrowRight,
  HiCheckCircle,
  HiUser,
  HiChevronLeft,
  HiEye,
  HiEyeOff
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { AccountStatus } from '../../interfaces/auth.interface';
import AuthLayout from '../../Components/layouts/AuthLayout';

const DriverLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error('Please fill all fields');
      return;
    }

    const loginData: any = {
      loginType: 'EMAIL_PASSWORD',
      password
    };

    // Check if identifier is email or mobile
    if (identifier.includes('@')) {
      loginData.email = identifier;
    } else {
      loginData.email = identifier; // backend authenticates by email; send mobile as email fallback
      loginData.mobile = identifier;
    }

    // result is AuthResponse directly (token, role, accountStatus, etc.)
    const result: any = await login(loginData);
    if (result) {
      handlePostLogin(result);
    }
  };

  const handlePostLogin = (user: any) => {
    if (user.role !== 'DRIVER') {
       toast.error('This login is for Drivers ONLY.');
       return;
    }

    switch (user.accountStatus) {
      case AccountStatus.REGISTERED:
        navigate('/profile');
        break;
      case AccountStatus.PENDING_VERIFICATION:
        navigate('/pending-approval');
        break;
      case AccountStatus.VERIFIED:
        navigate('/driver/dashboard');
        break;
      default:
        toast.error('Account not accessible');
    }
  };

  return (
    <AuthLayout title="Driver Login" subtitle="Enter your credentials to continue">
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Email or Mobile</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <HiUser className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-400 text-gray-800 font-medium"
              placeholder="name@email.com or 9876543210"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <HiLockClosed className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-400 text-gray-800 font-medium"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600 font-medium">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:underline">Forgot?</Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Authorise Login'} <HiArrowRight className="ml-2" />
        </button>
      </form>

      <div className="mt-10 text-center text-sm text-gray-500 font-medium">
        Don't have a Driver account? <Link to="/driver/register" className="text-blue-600 font-black hover:underline">Register Now</Link>
      </div>
    </AuthLayout>
  );
};

export default DriverLogin;
