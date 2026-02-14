import { useAuthStore } from '@/app/stores/auth.store';
import { useCallback } from 'react';

export const useAuth = () => {
  const auth = useAuthStore();

  const isAuthenticated = !!auth.token && !!auth.user;
  const isPatient = auth.user?.role === 'PATIENT';
  const isDoctor = auth.user?.role === 'DOCTOR';
  const isAdmin = auth.user?.role === 'ADMIN';
  const isStaff = auth.user?.role === 'STAFF';

  const hasRole = useCallback(
    (...roles: string[]) => {
      return auth.user ? roles.includes(auth.user.role) : false;
    },
    [auth.user]
  );

  return {
    ...auth,
    isAuthenticated,
    isPatient,
    isDoctor,
    isAdmin,
    isStaff,
    hasRole,
  };
};
