import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check for success message from password reset or email verification
  const message = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="social-login">
          <button onClick={handleGoogleLogin} className="google-btn" disabled={loading}>
            Sign in with Google
          </button>
        </div>
        <div className="auth-links">
          <a href="/forgot-password">Forgot Password?</a>
          <span className="separator">|</span>
          <a href="/register">Create Account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
