import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import { publicApi } from '../../services/api/protectedAndPublicAPI';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your email or mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicApi.post('/api/auth/forgot-password', { identifier });
      setIsSent(true);
      toast.success('Reset link sent!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <img src="/truckmitra-logo.png" alt="TruckMitra" className="h-16 w-auto" />
        </Link>
        <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
          Forgot Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100"
        >
          {isSent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <HiMail className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Check your inbox</h3>
              <p className="text-sm text-slate-500 mb-6">
                If an account exists for that identifier, we've sent instructions to reset your password.
              </p>
              <Link to="/login" className="text-blue-600 font-bold hover:text-blue-500 flex items-center justify-center">
                <HiArrowLeft className="mr-2" /> Back to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <p className="text-sm text-slate-500 mb-6 text-center">
                Enter the email address or mobile number associated with your account and we'll send you a link to reset your password.
              </p>
              
              <div>
                <label htmlFor="identifier" className="block text-sm font-bold text-slate-700">
                  Email or Mobile Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-slate-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 py-3 bg-slate-50 font-medium"
                    placeholder="Enter email or mobile"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-500 flex items-center justify-center">
                  <HiArrowLeft className="mr-2" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
