import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  // If still loading, show nothing or a loading spinner
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated but not admin, redirect to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and admin, render the children
  return <>{children}</>;
};

export default AdminRoute;