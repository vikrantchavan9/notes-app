import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GoogleAuthCallback: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  console.log('STEP 1: GoogleAuthCallback component has loaded.');

  useEffect(() => {
    console.log('STEP 2: useEffect hook is running.');

    const token = searchParams.get('token');
    
    console.log('STEP 3: Token found in URL:', token);

    if (token) {
      console.log('STEP 4: Token exists, calling login() and navigating to dashboard...');
      login(token, true); // Assume "remember me" is true for Google login
      navigate('/dashboard', { replace: true });
    } else {
      console.log('STEP 4: No token found, navigating to signup.');
      navigate('/signup', { replace: true });
    }
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Please wait while we sign you in...</p>
    </div>
  );
};

export default GoogleAuthCallback;