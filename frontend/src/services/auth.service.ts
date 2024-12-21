import api from './api';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

class AuthService {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/login', credentials);
      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials) {
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/register', credentials);
      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await api.post('/api/auth/logout');
      this.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      this.clearAuthData(); // Clear data even if logout request fails
      throw error;
    }
  }

  googleLogin() {
    window.location.href = `${api.defaults.baseURL}/api/auth/google`;
  }

  async getCurrentUser() {
    try {
      const response = await api.get<User>('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  setAuthData(token: string, user: User) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  clearAuthData() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    delete api.defaults.headers.common.Authorization;
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }
}

const authService = new AuthService();
export default authService;
