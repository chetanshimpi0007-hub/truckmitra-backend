import React from 'react';
import { Link } from 'react-router-dom';
import { LogisticsSide } from '../illustrations/LogisticsSide';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 bg-white relative z-10">
        <div className="mx-auto w-full max-w-sm lg:max-w-md py-12">
          
          {/* Logo & Header */}
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black tracking-tighter text-blue-600 flex items-center justify-center lg:justify-start">
                TruckMitra <span className="text-emerald-500 ml-1">.</span>
              </span>
            </Link>
            <h2 className="mt-8 text-3xl font-black text-gray-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="mt-8 bg-white">
            {children}
          </div>
          
        </div>
      </div>

      {/* Right Side - Hero Banner */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900">
        <LogisticsSide className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay" />
        {/* Glass Overlay over the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
        
        {/* Floating Content on the Right Side */}
        <div className="absolute bottom-0 left-0 right-0 p-16 xl:p-24">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-blue-500/30 mb-6">
              Smart Logistics Platform
            </div>
            <h3 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-6">
              Revolutionizing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Freight Transport
              </span>
            </h3>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-lg">
              Join India's fastest-growing ecosystem connecting shippers, fleet owners, and drivers with real-time tracking, digital PODs, and seamless payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
