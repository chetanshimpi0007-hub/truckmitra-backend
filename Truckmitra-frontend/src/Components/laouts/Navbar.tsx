// src/components/layout/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { useProfile } from '../../hooks/useProfile';
import { 
  HiMenu, 
  HiX, 
  HiHome, 
  HiInformationCircle, 
  HiPhone,
  HiUser,
  HiLogout,
  HiTruck,
  HiDocumentReport,
  HiUsers,
  HiClock,
  HiViewGrid as HiDashboard,
  HiDocumentText,
  HiPhotograph,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import { HiWallet, HiCurrencyDollar } from 'react-icons/hi2';
import { AccountStatus } from '../../interfaces/auth.interface';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  
  const { user, logout } = useAuth();
  const { profileComplete, documents, hasDocument } = useProfile();
  
  console.log('Navbar Rendered - User:', user);
  
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    return `/${user.role.toLowerCase()}/dashboard`;
  };

  const publicNavItems = [
    { label: 'Home', path: '/', icon: <HiHome className="w-5 h-5" /> },
    { label: 'About', path: '/about', icon: <HiInformationCircle className="w-5 h-5" /> },
    { label: 'Contact', path: '/contact', icon: <HiPhone className="w-5 h-5" /> },
  ];

  const getProtectedNavItems = () => {
    if (!user) return [];

    // Common items for all logged-in users
    const commonItems = [
      { label: 'Dashboard', path: getDashboardLink(), icon: <HiDashboard className="w-5 h-5" /> },
      { label: 'Profile', path: '/profile', icon: <HiUser className="w-5 h-5" /> },
      { label: 'Wallet', path: '/wallet', icon: <HiWallet className="w-5 h-5" /> },
    ];

    const roleSpecificItems: Record<string, any[]> = {
      DRIVER: [
        { label: 'Available Loads', path: '/loads', icon: <HiTruck className="w-5 h-5" /> },
        { label: 'My Trips', path: '/driver/trips', icon: <HiDocumentReport className="w-5 h-5" /> },
        { label: 'Earnings', path: '/driver/earnings', icon: <HiCurrencyDollar className="w-5 h-5" /> },
      ],
      SHIPPER: [
        { label: 'My Loads', path: '/shipper/loads', icon: <HiTruck className="w-5 h-5" /> },
        { label: 'Post Load', path: '/shipper/loads/create', icon: <HiTruck className="w-5 h-5" /> },
      ],
      TRANSPORTER: [
        { label: 'My Vehicles', path: '/transporter/vehicles', icon: <HiTruck className="w-5 h-5" /> },
        { label: 'My Drivers', path: '/transporter/drivers', icon: <HiUser className="w-5 h-5" /> },
      ],
      ADMIN: [
        { label: 'User Mgmt', path: '/admin/users', icon: <HiUsers className="w-5 h-5" /> },
        { label: 'Pending Approvals', path: '/admin/users?status=pending', icon: <HiClock className="w-5 h-5" /> },
        { label: 'Transactions', path: '/admin/transactions', icon: <HiCurrencyDollar className="w-5 h-5" /> },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[user.role] || [])];
  };

  // Show status badge if account is not verified
  const renderStatusBadge = () => {
    if (!user || user.role === 'ADMIN' || user.accountStatus === AccountStatus.VERIFIED) {
      return null;
    }

    const statusStyles = {
      [AccountStatus.REGISTERED]: 'bg-blue-100 text-blue-800',
      [AccountStatus.PENDING_VERIFICATION]: 'bg-yellow-100 text-yellow-800',
      [AccountStatus.REJECTED]: 'bg-red-100 text-red-800',
      [AccountStatus.SUSPENDED]: 'bg-orange-100 text-orange-800',
      [AccountStatus.DELETED]: 'bg-gray-100 text-gray-800',
    };

    const statusText = {
      [AccountStatus.REGISTERED]: 'Profile Incomplete',
      [AccountStatus.PENDING_VERIFICATION]: 'Pending Verification',
      [AccountStatus.REJECTED]: 'Rejected',
      [AccountStatus.SUSPENDED]: 'Suspended',
      [AccountStatus.DELETED]: 'Deleted',
    };

    return (
      <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[user.accountStatus]}`}>
        {statusText[user.accountStatus]}
      </span>
    );
  };

  // Profile completion indicator
  const renderProfileCompletionIndicator = () => {
    if (!user || user.role === 'ADMIN' || user.accountStatus !== AccountStatus.REGISTERED) {
      return null;
    }

    return (
      <div className="relative">
        <button
          onMouseEnter={() => setShowProfileTooltip(true)}
          onMouseLeave={() => setShowProfileTooltip(false)}
          className="ml-2 text-yellow-300 hover:text-yellow-200"
        >
          <HiExclamationCircle className="h-5 w-5" />
        </button>
        
        {showProfileTooltip && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-3 z-50 text-sm">
            <p className="font-medium text-gray-900 mb-1">Complete your profile</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {!profileComplete && (
                <>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Add your professional details
                  </li>
                  {documents.length === 0 && (
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Upload required documents
                    </li>
                  )}
                </>
              )}
            </ul>
            <Link
              to="/profile"
              className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-500"
              onClick={() => setShowProfileTooltip(false)}
            >
              Go to Profile →
            </Link>
          </div>
        )}
      </div>
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold tracking-tight mr-4">
              TruckMitra
            </Link>
            {renderStatusBadge()}
            {renderProfileCompletionIndicator()}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {(user ? getProtectedNavItems() : publicNavItems).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition-colors ${
                  isActive(item.path) ? 'bg-blue-800 shadow-inner' : ''
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="relative ml-2 flex items-center gap-4">
                <ThemeToggle />
                <button 
                  onClick={toggleProfileMenu} 
                  className="flex items-center focus:outline-none ring-2 ring-blue-400 rounded-full relative"
                >
                  {user.profileImageUrl ? (
                    <img className="h-8 w-8 rounded-full" src={user.profileImageUrl} alt="" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-medium relative">
                      {getInitials(user.fullName)}
                      {/* Document upload indicator */}
                      {documents.length > 0 && (
                        <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                  )}
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs font-medium text-gray-700 mr-2">{user.role}</span>
                        {user.accountStatus === AccountStatus.VERIFIED ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <HiCheckCircle className="mr-1 h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <HiExclamationCircle className="mr-1 h-3 w-3" /> Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Profile Completion Status */}
                    {!profileComplete && user.accountStatus === AccountStatus.REGISTERED && (
                      <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-yellow-800">Profile Completion</span>
                          <span className="text-xs font-medium text-yellow-800">60%</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-1.5">
                          <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <Link 
                          to="/profile" 
                          className="mt-2 text-xs text-yellow-700 hover:text-yellow-600 block"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Complete your profile →
                        </Link>
                      </div>
                    )}

                    {/* Menu Items */}
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <HiUser className="mr-2 h-4 w-4 text-gray-500" />
                      Profile Settings
                    </Link>
                    
                    <Link 
                      to="/profile/documents" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center justify-between"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <HiDocumentText className="mr-2 h-4 w-4 text-gray-500" />
                        Documents
                      </span>
                      {documents.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {documents.length}
                        </span>
                      )}
                    </Link>
                    
                    <Link 
                      to="/wallet" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <HiWallet className="mr-2 h-4 w-4 text-gray-500" />
                      Wallet
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <HiLogout className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <ThemeToggle />
                <Link to="/login" className="text-white px-4 py-2 text-sm font-medium hover:underline">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={toggleMenu} className="text-white p-2 ml-2">
              {isOpen ? <HiX size={24}/> : <HiMenu size={24}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500 pb-4">
          <div className="px-2 pt-2 space-y-1">
            {(user ? getProtectedNavItems() : publicNavItems).map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={toggleMenu} 
                className="flex items-center px-3 py-3 text-white hover:bg-blue-800 rounded-md"
              >
                <span className="mr-4 text-blue-200">{item.icon}</span> 
                {item.label}
              </Link>
            ))}
            
            {user && (
              <>
                {/* User Info in Mobile Menu */}
                <div className="px-3 py-3 border-t border-blue-500 mt-2">
                  <div className="flex items-center">
                    {user.profileImageUrl ? (
                      <img className="h-10 w-10 rounded-full" src={user.profileImageUrl} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-medium">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user.fullName}</p>
                      <p className="text-xs text-blue-200">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Mobile Profile Stats */}
                  {!profileComplete && (
                    <div className="mt-3 bg-blue-800 rounded-lg p-3">
                      <p className="text-xs text-blue-200 mb-1">Complete your profile</p>
                      <div className="w-full bg-blue-600 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <Link 
                        to="/profile" 
                        className="mt-2 text-xs text-yellow-300 block"
                        onClick={toggleMenu}
                      >
                        Complete Now →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Actions */}
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-3 text-white hover:bg-blue-800 rounded-md"
                  onClick={toggleMenu}
                >
                  <HiUser className="mr-4 text-blue-200" />
                  Profile
                  {!profileComplete && (
                    <span className="ml-2 bg-yellow-500 text-xs px-2 py-0.5 rounded-full">!</span>
                  )}
                </Link>

                <Link 
                  to="/profile/documents" 
                  className="flex items-center px-3 py-3 text-white hover:bg-blue-800 rounded-md"
                  onClick={toggleMenu}
                >
                  <HiDocumentText className="mr-4 text-blue-200" />
                  Documents
                  {documents.length > 0 && (
                    <span className="ml-2 bg-blue-500 text-xs px-2 py-0.5 rounded-full">
                      {documents.length}
                    </span>
                  )}
                </Link>

                <Link 
                  to="/wallet" 
                  className="flex items-center px-3 py-3 text-white hover:bg-blue-800 rounded-md"
                  onClick={toggleMenu}
                >
                  <HiWallet className="mr-4 text-blue-200" />
                  Wallet
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center px-3 py-3 text-red-200 hover:bg-red-900 rounded-md"
                >
                  <HiLogout className="mr-4" /> 
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;