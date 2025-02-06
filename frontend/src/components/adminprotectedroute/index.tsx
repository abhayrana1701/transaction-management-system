import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const userRole = useSelector((state: any) => state.auth.user?.role); // Accessing role from user

  // If the user is not an admin, redirect to the home page (or any other page)
  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
