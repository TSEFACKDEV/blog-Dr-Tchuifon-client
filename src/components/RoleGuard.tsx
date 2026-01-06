import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Spinner from './ui/Spinner';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('ADMIN' | 'COLLABORATOR' | 'VISITOR')[];
  redirectTo?: string;
}

/**
 * RoleGuard - Protège les routes selon les rôles autorisés
 * 
 * Usage:
 * <RoleGuard allowedRoles={['ADMIN']}>
 *   <AdminPage />
 * </RoleGuard>
 * 
 * <RoleGuard allowedRoles={['ADMIN', 'COLLABORATOR']}>
 *   <SharedPage />
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = '/auth/login'
}) => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'COLLABORATOR') {
      return <Navigate to="/collaborator/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // User has required role - allow access
  return <>{children}</>;
};
