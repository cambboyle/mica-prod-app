import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setIsLoading(false);
    } catch (err) {
      setError('Login failed');
      setIsLoading(false);
      throw new Error('Login failed');
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        email,
        password,
        displayName,
      });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setIsLoading(false);
    } catch (err) {
      setError('Registration failed');
      setIsLoading(false);
      throw new Error('Registration failed');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
      setUser(null);
      localStorage.removeItem('token');
      setIsLoading(false);
    } catch (err) {
      setError('Logout failed');
      setIsLoading(false);
      throw new Error('Logout failed');
    }
  }, []);

  const googleLogin = useCallback(async () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-email`, { token });
      setIsLoading(false);
    } catch (err) {
      setError('Email verification failed');
      setIsLoading(false);
      throw new Error('Email verification failed');
    }
  }, []);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
      setIsLoading(false);
    } catch (err) {
      setError('Failed to send password reset email');
      setIsLoading(false);
      throw new Error('Failed to send password reset email');
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
      setIsLoading(false);
    } catch (err) {
      setError('Password reset failed');
      setIsLoading(false);
      throw new Error('Password reset failed');
    }
  }, []);

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    error,
    login,
    register,
    logout,
    googleLogin,
    verifyEmail,
    sendPasswordResetEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
