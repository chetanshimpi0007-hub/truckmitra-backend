// src/routes/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hook';

const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Agar user already logged in hai to dashboard par bhejo
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoute;