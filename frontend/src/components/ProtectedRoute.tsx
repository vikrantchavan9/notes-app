import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();

   if (!token) {
    console.log('No token found! Redirecting to /signup.');
    return <Navigate to="/signup" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;