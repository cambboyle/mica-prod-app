import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await axios.post(`${API_URL}/auth/register`, credentials, { withCredentials: true });
    return response.data;
  },

  async logout() {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  },

  googleLogin() {
    window.location.href = `${API_URL}/auth/google`;
  },

  async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
    return response.data;
  },

  setAuthToken(token: string | null) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }
};

export default authService;
