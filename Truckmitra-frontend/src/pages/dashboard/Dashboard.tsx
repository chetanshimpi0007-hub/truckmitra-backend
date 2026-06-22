// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { useAuth } from '../../hooks/auth.hook';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HiCheckCircle, 
  HiClock, 
  HiExclamationCircle, 
  HiBan, 
  HiTrash,
  HiUser,
  HiTruck,
  HiShoppingCart,
  HiUserGroup,
  HiDocumentText,
  HiArrowRight,
  HiShieldCheck,
  HiShieldExclamation,
  HiXCircle,
  HiBadgeCheck
} from 'react-icons/hi';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Debug: Log user object to see what's coming

  // Get status-specific styles and messages
  const getStatusInfo = () => {
    switch (user?.accountStatus) {
      case 'REGISTERED':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: <HiDocumentText className="h-6 w-6 text-blue-600" />,
          title: '📝 Profile Incomplete',
          message: 'Please complete your profile to start using TruckMitra.',
          action: 'Complete Profile',
          actionLink: '/profile',
          showAction: true,
          verificationBadge: 'Not Verified',
          verificationColor: 'bg-gray-100 text-gray-600',
          isVerified: false
        };
      
      case 'PENDING_VERIFICATION':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: <HiClock className="h-6 w-6 text-yellow-600" />,
          title: '⏳ Pending Verification',
          message: 'Your profile is complete and pending admin verification. This usually takes 24-48 hours.',
          action: 'Check Status',
          actionLink: '/pending-approval',
          showAction: true,
          verificationBadge: 'Pending Verification',
          verificationColor: 'bg-yellow-100 text-yellow-800',
          isVerified: false
        };
      
      case 'VERIFIED':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: <HiCheckCircle className="h-6 w-6 text-green-600" />,
          title: '✅ Account Verified',
          message: 'Your account is fully verified. You can now use all features!',
          action: 'Go to Dashboard',
          actionLink: `/${user.role.toLowerCase()}/dashboard`,
          showAction: true,
          verificationBadge: 'Verified Account',
          verificationColor: 'bg-green-100 text-green-800',
          isVerified: true
        };
      
      case 'REJECTED':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: <HiExclamationCircle className="h-6 w-6 text-red-600" />,
          title: '❌ Verification Rejected',
          message: 'Your verification was rejected. Please contact support for assistance.',
          action: 'Contact Support',
          actionLink: '/contact',
          showAction: true,
          verificationBadge: 'Rejected',
          verificationColor: 'bg-red-100 text-red-800',
          isVerified: false
        };
      
      case 'SUSPENDED':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          icon: <HiBan className="h-6 w-6 text-orange-600" />,
          title: '⚠️ Account Suspended',
          message: 'Your account has been suspended. Please contact support for assistance.',
          action: 'Contact Support',
          actionLink: '/contact',
          showAction: true,
          verificationBadge: 'Suspended',
          verificationColor: 'bg-orange-100 text-orange-800',
          isVerified: false
        };
      
      case 'DELETED':
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: <HiTrash className="h-6 w-6 text-gray-600" />,
          title: '🗑️ Account Deleted',
          message: 'This account has been deleted. Please contact support if you think this is a mistake.',
          action: 'Contact Support',
          actionLink: '/contact',
          showAction: true,
          verificationBadge: 'Deleted',
          verificationColor: 'bg-gray-100 text-gray-800',
          isVerified: false
        };
      
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: <HiUser className="h-6 w-6 text-gray-600" />,
          title: 'Account Status Unknown',
          message: 'Please contact support for assistance.',
          action: 'Contact Support',
          actionLink: '/contact',
          showAction: true,
          verificationBadge: 'Unknown',
          verificationColor: 'bg-gray-100 text-gray-800',
          isVerified: false
        };
    }
  };

  // Get role-specific icon
  const getRoleIcon = () => {
    switch (user?.role) {
      case 'DRIVER':
        return <HiTruck className="h-5 w-5 text-blue-600" />;
      case 'SHIPPER':
        return <HiShoppingCart className="h-5 w-5 text-green-600" />;
      case 'TRANSPORTER':
        return <HiUserGroup className="h-5 w-5 text-purple-600" />;
      case 'ADMIN':
        return <HiUser className="h-5 w-5 text-red-600" />;
      default:
        return <HiUser className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get role-specific dashboard link
  const getRoleDashboardLink = () => {
    if (!user) return '/dashboard';
    
    // Only verified users can access role-specific dashboards
    if (user.accountStatus !== 'VERIFIED') {
      return '/dashboard';
    }
    
    switch (user.role) {
      case 'DRIVER':
        return '/driver/dashboard';
      case 'SHIPPER':
        return '/shipper/dashboard';
      case 'TRANSPORTER':
        return '/transporter/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Get status badge color
  const getStatusBadgeClass = () => {
    switch (user?.accountStatus) {
      case 'REGISTERED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_VERIFICATION':
        return 'bg-yellow-100 text-yellow-800';
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800';
      case 'DELETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status display text
  const getStatusDisplayText = () => {
    switch (user?.accountStatus) {
      case 'REGISTERED':
        return 'Registered (Profile Incomplete)';
      case 'PENDING_VERIFICATION':
        return 'Pending Verification';
      case 'VERIFIED':
        return 'Verified ✓';
      case 'REJECTED':
        return 'Rejected ✗';
      case 'SUSPENDED':
        return 'Suspended ⚠';
      case 'DELETED':
        return 'Deleted 🗑';
      default:
        return user?.accountStatus || 'Unknown';
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">TruckMitra</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 flex items-center">
                Welcome, {user?.fullName}
                <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass()}`}>
                  {getStatusDisplayText()}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* ✅ PROMINENT VERIFICATION STATUS BANNER */}
        <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <div className={`px-6 py-4 ${
            statusInfo.isVerified 
              ? 'bg-gradient-to-r from-green-600 to-green-800' 
              : 'bg-gradient-to-r from-yellow-600 to-yellow-800'
          }`}>
            <h2 className="text-xl font-bold text-white flex items-center">
              {statusInfo.isVerified ? (
                <HiBadgeCheck className="mr-2 h-6 w-6" />
              ) : (
                <HiShieldExclamation className="mr-2 h-6 w-6" />
              )}
              Account Verification Status
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                {statusInfo.isVerified ? (
                  <div className="bg-green-100 rounded-full p-4 mr-4">
                    <HiCheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-yellow-100 rounded-full p-4 mr-4">
                    <HiXCircle className="h-16 w-16 text-yellow-600" />
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Verification Status</p>
                  <div className="flex items-center">
                    <p className={`text-3xl font-extrabold ${statusInfo.textColor} mr-3`}>
                      {statusInfo.isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
                    </p>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${statusInfo.verificationColor}`}>
                      {statusInfo.verificationBadge}
                    </span>
                  </div>
                  
                  {user?.isProfileComplete ? (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <HiCheckCircle className="mr-1" /> Profile Completed
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-600 mt-2 flex items-center">
                      <HiClock className="mr-1" /> Profile Incomplete
                    </p>
                  )}
                </div>
              </div>
              
              {statusInfo.showAction && (
                <Link
                  to={statusInfo.actionLink}
                  className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white ${
                    statusInfo.isVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {statusInfo.action}
                  <HiArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`mb-6 p-6 ${statusInfo.bgColor} border-2 ${statusInfo.borderColor} rounded-lg shadow-sm`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {statusInfo.icon}
            </div>
            <div className="ml-4 flex-1">
              <h2 className={`text-xl font-bold ${statusInfo.textColor} mb-2`}>
                {statusInfo.title}
              </h2>
              <p className={`text-base ${statusInfo.textColor} mb-3`}>
                {statusInfo.message}
              </p>

              {/* Quick Info */}
              <div className="mt-3 flex flex-wrap gap-3">
                <div className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">
                  <span className="font-medium">Role:</span> {user?.role}
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">
                  <span className="font-medium">Status:</span> {getStatusDisplayText()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="flex items-center mb-6">
              {getRoleIcon()}
              <h2 className="text-2xl font-bold text-gray-900 ml-2">
                Welcome to your Dashboard
              </h2>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Account Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Name:</span> {user?.fullName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Email:</span> {user?.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Mobile:</span> {user?.mobile}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Verification Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-medium">Verified:</span>
                    {statusInfo.isVerified ? (
                      <span className="text-green-600 font-bold flex items-center text-base">
                        <HiCheckCircle className="mr-1 h-5 w-5" /> YES
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold flex items-center text-base">
                        <HiXCircle className="mr-1 h-5 w-5" /> NO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-700 font-medium">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass()}`}>
                      {getStatusDisplayText()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-medium">Profile:</span>
                    <span className={user?.isProfileComplete ? 'text-green-600' : 'text-yellow-600'}>
                      {user?.isProfileComplete ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Wallet Info</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Wallet:</span>{' '}
                    {user?.wallet ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-500">Not Setup</span>
                    )}
                  </p>
                  {user?.wallet && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Balance:</span> ₹{user.wallet.currentBalance}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status-based guidance */}
            {user?.accountStatus === 'REGISTERED' && (
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">📋 Next Steps to Get Verified:</h3>
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-3 bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">1</span>
                    Complete your profile with all required information
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">2</span>
                    Add your vehicle details and upload documents (for Drivers)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">3</span>
                    Wait for admin verification (usually takes 24-48 hours)
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-bold">Note:</span> You cannot access business features until your account is verified.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Complete Profile Now
                    <HiArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {user?.accountStatus === 'PENDING_VERIFICATION' && (
              <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">⏳ Verification in Progress:</h3>
                <p className="text-yellow-800 mb-4">
                  Your documents are being reviewed by our team. You'll be notified once verified.
                </p>
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Expected time:</span> 24-48 hours
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-bold">Note:</span> You will receive an email and SMS notification once your account is verified.
                  </p>
                </div>
              </div>
            )}

            {user?.accountStatus === 'VERIFIED' && (
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-4">🎉 Congratulations! Your Account is Verified</h3>
                <p className="text-green-800 mb-4">
                  You now have full access to all TruckMitra features.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">What you can do now:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Post and find loads</li>
                      <li>Place and receive bids</li>
                      <li>Start and complete trips</li>
                      <li>Access wallet and payments</li>
                    </ul>
                  </div>
                </div>
                <Link
                  to={getRoleDashboardLink()}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                >
                  Go to {user.role} Dashboard
                  <HiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}

            {(user?.accountStatus === 'REJECTED' || user?.accountStatus === 'SUSPENDED') && (
              <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                <h3 className="text-lg font-bold text-red-900 mb-3">❗ Action Required:</h3>
                <p className="text-red-800 mb-4">
                  {user?.accountStatus === 'REJECTED' 
                    ? 'Your verification was rejected. Please contact our support team for assistance.'
                    : 'Your account has been suspended. Please contact our support team for assistance.'}
                </p>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-bold">Support Email:</span> support@truckmitra.com
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Support Phone:</span> +91 1234567890
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                >
                  Contact Support
                  <HiArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;