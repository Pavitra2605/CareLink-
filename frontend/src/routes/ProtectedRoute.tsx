import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, token, user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { 
    isAuthenticated, 
    token: token?.substring(0, 20) + '...', 
    user, 
    pathname: location.pathname 
  });

  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasRole(...roles)) {
      console.log('ProtectedRoute: User does not have required role', { required: roles, actual: user?.role });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
