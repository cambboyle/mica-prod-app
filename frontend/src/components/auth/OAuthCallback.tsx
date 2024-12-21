import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/auth.types';
import './OAuthCallback.css';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userDataStr = searchParams.get('userData');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (!token || !userDataStr) {
      console.error('Missing token or user data');
      navigate('/login?error=invalid_oauth_callback');
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userDataStr)) as User;
      loginWithToken(token, userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to process OAuth callback:', err);
      navigate('/login?error=oauth_processing_failed');
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="oauth-callback">
      <div className="loading-spinner">
        <p>Processing login...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
