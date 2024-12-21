import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Invalid verification token');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        navigate('/login', { state: { message: 'Email verified successfully! You can now log in.' } });
      } catch (err) {
        setError('Failed to verify email');
        setLoading(false);
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  if (loading) {
    return (
      <div className="auth-container">
        <h2 className="text-center">Verifying Email...</h2>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2 className="text-center">Email Verification</h2>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VerifyEmail;
