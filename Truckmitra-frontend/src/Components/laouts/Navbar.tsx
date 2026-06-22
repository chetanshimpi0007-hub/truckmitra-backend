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
  HiExclamationCircle,
  HiChevronRight
} from 'react-icons/hi';
import { HiWallet, HiCurrencyDollar } from 'react-icons/hi2';
import { AccountStatus } from '../../interfaces/auth.interface';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  // Stop background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const { user, logout, token } = useAuth();
  const { profileComplete, documents, hasDocument } = useProfile();
  
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

    // If user is not verified, only show Profile link
    if (user.role !== 'ADMIN' && user.accountStatus !== AccountStatus.VERIFIED) {
      return [
        { label: 'Profile', path: '/profile', icon: <HiUser className="w-5 h-5" /> }
      ];
    }

    // Common items for all logged-in verified users
    const commonItems = [
      { label: 'Dashboard', path: getDashboardLink(), icon: <HiDashboard className="w-5 h-5" /> },
      { label: 'Profile', path: '/profile', icon: <HiUser className="w-5 h-5" /> },
      { label: 'Wallet', path: '/wallet', icon: <HiWallet className="w-5 h-5" /> },
      { label: 'Contact', path: '/contact', icon: <HiPhone className="w-5 h-5" /> },
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
              <div className="relative ml-2 flex items-center gap-3">
                <ThemeToggle />
                {user && token && (
                  <NotificationBell userId={user.id} token={token} />
                )}
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
            {user && token && (
              <NotificationBell userId={user.id} token={token} />
            )}
            <ThemeToggle />
            <button onClick={toggleMenu} className="text-white p-2 ml-2">
              {isOpen ? <HiX size={24}/> : <HiMenu size={24}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-[80vw] sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-blue-600">
          <span className="font-bold text-white text-lg">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white p-1">
            <HiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
          {user && (
            <div className="px-6 py-6 border-b border-slate-200 bg-white">
              <div className="flex items-center space-x-3">
                {user.profileImageUrl ? (
                  <img className="h-12 w-12 rounded-full border-2 border-blue-100" src={user.profileImageUrl} alt="" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {getInitials(user.fullName)}
                  </div>
                )}
                <div>
                  <p className="text-base font-black text-slate-900">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              
              {/* Mobile Profile Stats */}
              {!profileComplete && (
                <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-2">Complete your profile</p>
                  <div className="w-full bg-amber-200 rounded-full h-1.5 mb-2">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center"
                    onClick={toggleMenu}
                  >
                    Complete Now <HiChevronRight className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="px-4 py-4 space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">Navigation</div>
            {(user ? getProtectedNavItems() : publicNavItems).map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={toggleMenu} 
                className={`flex items-center px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={`mr-3 ${isActive(item.path) ? 'text-blue-500' : 'text-slate-400'}`}>{item.icon}</span> 
                {item.label}
              </Link>
            ))}
            
            {user && (
              <>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mt-6 mb-2">Account</div>
                <Link 
                  to="/profile" 
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive('/profile') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  onClick={toggleMenu}
                >
                  <div className="flex items-center">
                    <HiUser className={`mr-3 ${isActive('/profile') ? 'text-blue-500' : 'text-slate-400'}`} />
                    Profile Settings
                  </div>
                  {!profileComplete && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-black">ACTION NEEDED</span>
                  )}
                </Link>

                <Link 
                  to="/profile/documents" 
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive('/profile/documents') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  onClick={toggleMenu}
                >
                  <div className="flex items-center">
                    <HiDocumentText className={`mr-3 ${isActive('/profile/documents') ? 'text-blue-500' : 'text-slate-400'}`} />
                    Documents
                  </div>
                  {documents.length > 0 && (
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
                      {documents.length}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
          
          {user && (
            <div className="mt-auto p-4 border-t border-slate-200 bg-white">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all border border-rose-100"
              >
                <HiLogout className="mr-2 w-5 h-5" /> 
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;