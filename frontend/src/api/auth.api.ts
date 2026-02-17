import { api } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'STAFF';
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'PATIENT' | 'DOCTOR';
}

export interface Profile {
  id: string;
  user_id: string;
  date_of_birth: string;
  gender: string;
  address: string;
  medical_history?: string;
}

const authAPI = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<LoginResponse>('/auth/register', data),

  me: () =>
    api.get<any>('/auth/me'),

  // Refresh token endpoint - to be implemented
  // refresh: (refreshToken: string) =>
  //   api.post<LoginResponse>('/auth/refresh', { refreshToken }),

  // Logout endpoint - to be implemented (optional for JWT)
  // logout: () =>
  //   api.post('/auth/logout'),
};

export default authAPI;
