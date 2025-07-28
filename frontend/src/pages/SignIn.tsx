import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';

import LogoIcon from '../assets/icon.png';
import abstractBg from '../assets/right-column.png';
import EyeOpenIcon from '../assets/open-eye-icon.png'; 
import EyeClosedIcon from '../assets/eye-icon.png';

import { requestLoginOtp, verifyOtp } from '../services/api';
import { useAuth } from '../hooks/useAuth';


const SignInPage: React.FC = () => {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For success messages like "OTP sent!"
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Function for the "Resend OTP" link
  const handleRequestOtp = async () => {
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    setError(null);
    setMessage('Sending OTP...');
    try {
      const data = await requestLoginOtp(email);
      setMessage(data.message); // Show success message from backend
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setMessage(null);
    }
  };

  // Function for the main "Sign In" button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const data = await verifyOtp(email, otp);
      login(data.token, keepLoggedIn);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-white">
      {/* Form Section */}
      <div className="lg:col-span-5 relative flex flex-col justify-center px-6 pt-12 pb-6 lg:px-8">
        <div className="hidden lg:block absolute top-8 left-8">
          <div className="flex items-center gap-2">
            <img className="h-8 w-auto" src={LogoIcon} alt="HD Logo" />
            <span className="text-2xl font-bold">HD</span>
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 justify-center">
            <img className="h-8 w-auto" src={LogoIcon} alt="HD Logo" />
            <span className="text-2xl font-bold">HD</span>
          </div>
          <div className="mt-8 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold leading-9 tracking-tight text-gray-900">
              Sign In
            </h2>
            <p className="mt-2 text-sm lg:text-lg leading-6 text-gray-500">
              Please login to continue to your account.
            </p>
          </div>
          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="relative group">
                <label
                  htmlFor="email"
                  className="absolute -top-2.5 left-2 z-10 inline-block bg-white px-1 text-sm font-medium text-blue-600"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jonas_kahnwald@gmail.com"
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-2 ring-inset ring-blue-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                />
              </div>

              {/* OTP Input */}
              <div className="relative group">
                <label
                  htmlFor="otp"
                  className="absolute -top-2.5 left-2 z-10 inline-block bg-white px-1 text-sm font-medium text-gray-600 group-focus-within:text-blue-600"
                >
                  OTP
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type={showOtp ? 'text' : 'password'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {/* --- Toggle Eye icon --- */}
                    {showOtp ? (
                      <img src={EyeClosedIcon} alt="Hide OTP" className="w-5 h-5" />
                    ) : (
                      <img src={EyeOpenIcon} alt="Open OTP" className="w-5 h-5 opacity-50" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
                <div className="flex items-center">
                  <input
                    id="keep-logged-in"
                    name="keep-logged-in"
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-gray-900">
                    Keep me logged in
                  </label>
                </div>
              </div>

              {/* Display feedback messages */}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {message && <p className="text-green-600 text-sm text-center">{message}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm lg:text-lg font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-400"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
            <p className="mt-10 text-center text-sm lg:text-lg text-gray-500">
              Need an account?{' '}
              <Link to="/signup" className="font-semibold leading-6 text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Image Section */}
      <div className="hidden lg:block lg:col-span-7">
        <img
          className="h-full w-full object-cover"
          src={abstractBg}
          alt="Abstract background"
        />
      </div>
    </div>
  );
};

export default SignInPage;