export interface User {
  id: number;
  email: string;
  displayName: string;
  profilePic?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  clearError?: () => void;
}
