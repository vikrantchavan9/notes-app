
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GoogleAuthCallback: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // If a token is found in the URL, save it using our login function
      login(token, false);
      // Then, navigate to the secure dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // If no token is found for some reason, go back to the signup page
      navigate('/signup', { replace: true });
    }
  }, [login, navigate, searchParams]);

  // Render a simple loading message while the redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Please wait while we sign you in...</p>
    </div>
  );
};

export default GoogleAuthCallback;