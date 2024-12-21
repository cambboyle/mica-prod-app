import api from './api';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/register', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get<User>('/api/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  googleLogin() {
    window.location.href = `${api.defaults.baseURL}/api/auth/google`;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;
