import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OAuthCallback.css';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userDataStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (token && userDataStr) {
      try {
        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        
        // Update auth context with token and user data
        loginWithToken(token, userData);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Error handling OAuth callback:', err);
        navigate('/login?error=auth_failed');
      }
    } else {
      navigate('/login?error=incomplete_auth_data');
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="auth-callback-container">
      <div className="loading-spinner"></div>
      <p>Completing your sign in...</p>
    </div>
  );
};

export default OAuthCallback;
