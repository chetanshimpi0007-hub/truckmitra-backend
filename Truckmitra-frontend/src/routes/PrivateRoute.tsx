// src/routes/PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hook';
import { AccountStatus } from '../interfaces/auth.interface';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  // ✅ ADMIN - Full access regardless of status
  if (user?.role === 'ADMIN') {
    return <Outlet />;
  }

  // ✅ Paths allowed for both REGISTERED and PENDING_VERIFICATION users
  const profilePaths = [
    '/profile',
    '/profile/edit',
    '/profile/documents',
    '/pending-approval'
  ];

  const currentPath = location.pathname;

  // ✅ Check account status and redirect accordingly
  switch (user?.accountStatus) {
    case AccountStatus.DELETED:
    case AccountStatus.REJECTED:
    case AccountStatus.SUSPENDED:
      // These accounts cannot access anything
      return <Navigate to="/login" />;

    case AccountStatus.REGISTERED:
      // REGISTERED users can ONLY access profile-related pages
      if (profilePaths.includes(currentPath)) {
        return <Outlet />;
      }
      // If trying to access any other page, redirect to profile to complete it
      return <Navigate to="/profile" />;

    case AccountStatus.PENDING_VERIFICATION:
      // PENDING users can access profile pages to view/edit documents
      if (profilePaths.includes(currentPath)) {
        return <Outlet />;
      }
      // ✅ FIX: Agar user dashboard ya kisi aur path par jane ki koshish kare
      // toh use pending approval screen par hi rakhein.
      return <Navigate to="/pending-approval" />;

    case AccountStatus.VERIFIED:
      // VERIFIED users have full access based on role
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
      }
      return <Outlet />;

    default:
      return <Navigate to="/login" />;
  }
};

export default PrivateRoute;