import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import LogoIcon from '../assets/icon.png';
import abstractBg from '../assets/right-column.png';
import EyeOpenIcon from '../assets/open-eye-icon.png';
import EyeClosedIcon from '../assets/eye-icon.png';

import { requestLoginOtp, verifyOtp } from '../services/api';
import { useAuth } from '../hooks/useAuth';

import axios from 'axios';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Track if OTP was sent
  const [showOtp, setShowOtp] = useState(false); // To toggle OTP visibility
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For success/info messages
  const [otpLoading, setOtpLoading] = useState(false); // Loading state when sending OTP
  const [signInLoading, setSignInLoading] = useState(false); // Loading state when signing in

  const navigate = useNavigate();
  const { login } = useAuth();

  // Simple email regex validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Function for the "Resend OTP" link or initial "Send OTP"
  const handleRequestOtp = async () => {
    // Preserve your original comment
    if (!email.trim()) {
      setError('Please enter your email first.');
      setMessage(null);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address.');
      setMessage(null);
      return;
    }

    setError(null);
    setMessage('Sending OTP...');
    setOtpLoading(true);
    try {
      const data = await requestLoginOtp(email.trim());
      setMessage(data.message || 'OTP sent successfully!');
      setOtpSent(true); // Mark OTP as sent
      setShowOtp(true);  // Show OTP input now
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Preserve your original comment style here
        if (axios.isAxiosError(err) && err.response) {
          const msg = err.response.data?.message || err.response.data?.error || err.message;
          setError(msg);
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred while sending OTP.');
      }
      setMessage(null);
    } finally {
      setOtpLoading(false);
    }
  };

  // Function for the main "Sign In" button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!otp.trim()) {
      setError('OTP is required.');
      return;
    }

    setSignInLoading(true);

    try {
      const data = await verifyOtp(email.trim(), otp.trim());
      login(data.token, keepLoggedIn);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err) && err.response) {
          const msg =
            err.response.data?.message || err.response.data?.error || 'Failed to verify OTP.';
          const lowerMsg = (msg as string).toLowerCase();
          if (lowerMsg.includes('otp')) {
            setError(
              'Invalid or expired OTP. Please try again or request a new one.'
            );
          } else {
            setError(msg as string);
          }
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setSignInLoading(false);
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
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Email Input */}
              <div className="relative group">
                <label
                  htmlFor="email"
                  className="absolute -top-2.5 left-2 z-10 inline-block bg-white px-1 text-sm font-medium text-gray-600 group-focus-within:text-blue-600"
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
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                  aria-invalid={!!error && (!email.trim() || !isValidEmail(email))}
                  aria-describedby="email-error"
                />
              </div>

              {/* OTP Input - shown once OTP requested */}
              {showOtp && (
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
                      type={showOtp ? (showOtp ? 'text' : 'password') : 'password'}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                      aria-invalid={!!error && !otp.trim()}
                      aria-describedby="otp-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      aria-label={showOtp ? 'Hide OTP' : 'Show OTP'}
                    >
                      {/* --- Toggle Eye icon --- */}
                      {showOtp ? (
                        <img src={EyeClosedIcon} alt="Hide OTP" className="w-5 h-5" />
                      ) : (
                        <img src={EyeOpenIcon} alt="Show OTP" className="w-5 h-5 opacity-50" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-sm font-medium text-blue-600 hover:underline"
                  disabled={otpLoading}
                >
                  {otpLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
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
              {error && (
                <p
                  id="error-message"
                  className="text-red-600 text-sm text-center mt-2"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </p>
              )}
              {message && (
                <p
                  id="success-message"
                  className="text-blue-600 text-sm text-center mt-2"
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={signInLoading}
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm lg:text-lg font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-400"
                >
                  {signInLoading ? 'Signing In...' : 'Sign In'}
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
        <img className="h-full w-full object-cover" src={abstractBg} alt="Abstract background" />
      </div>
    </div>
  );
};

export default SignInPage;
