import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // If there's no token, redirect to the signup page
    return <Navigate to="/signup" />;
  }

  // If there is a token, render the child components (e.g., the Dashboard)
  return <>{children}</>;
};

export default ProtectedRoute;