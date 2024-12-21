import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for session expired message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_expired')) {
      setError('Your session has expired. Please log in again.');
    }
  }, []);

  return <div>Login Page</div>;
};

export default LoginPage;