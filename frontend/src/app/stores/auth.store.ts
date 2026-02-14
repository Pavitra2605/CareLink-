import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authAPI from '@/api/auth.api';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string, role: 'PATIENT' | 'DOCTOR') => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.login({ email, password });
          set({
            token: data.token,
            refreshToken: data.refreshToken,
            user: data.user,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string, phone: string, role: 'PATIENT' | 'DOCTOR') => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register({ email, password, name, phone, role });
          set({
            token: data.token,
            refreshToken: data.refreshToken,
            user: data.user,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          refreshToken: null,
          user: null,
          error: null,
        });
      },

      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
