
// src/components/ProtectedRoute.js
// A component to protect routes that require authentication.

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optional: Show a loading spinner while checking auth state
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!currentUser) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the route requires specific roles, check if the user has one
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If user does not have the required role, redirect them to the homepage
    // You could also show an "Unauthorized" page here
    return <Navigate to="/" replace />;
  }

  // If user is logged in and has the correct role (if required), show the page
  return <Outlet />;
};

export default ProtectedRoute;
