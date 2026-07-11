import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (role) => String(role ?? '').toLowerCase();

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = normalizeRole(user?.role ?? user?.Role);
  const authorized = allowedRoles
    .map(normalizeRole)
    .some((role) => role === userRole || (role === 'admin' && userRole === '1'));

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}
