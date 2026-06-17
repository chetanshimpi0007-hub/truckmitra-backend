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

const ShipperLogin: React.FC = () => {
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

    if (identifier.includes('@')) {
      loginData.email = identifier;
    } else {
      loginData.mobile = identifier;
    }

    const result: any = await login(loginData);
    if (result) {
      handlePostLogin(result);
    }
  };

  const handlePostLogin = (user: any) => {
    if (user.role !== 'SHIPPER') {
       toast.error('This login is for Shippers ONLY.');
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
        navigate('/shipper/dashboard');
        break;
      default:
        toast.error('Account not accessible');
    }
  };

  return (
    <AuthLayout title="Shipper Login" subtitle="Enter your business credentials">
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Email or Mobile</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <HiUser className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all placeholder:text-gray-400 text-gray-800 font-medium"
              placeholder="company@email.com or 9876543210"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <HiLockClosed className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all placeholder:text-gray-400 text-gray-800 font-medium"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? 'Authenticating...' : 'Access Dashboard'} <HiArrowRight className="ml-2" />
        </button>
      </form>

      <div className="mt-10 text-center text-sm text-gray-500 font-medium">
        New to TruckMitra Shippers? <Link to="/shipper/register" className="text-indigo-600 font-black hover:underline">Create Account</Link>
      </div>
    </AuthLayout>
  );
};

export default ShipperLogin;
