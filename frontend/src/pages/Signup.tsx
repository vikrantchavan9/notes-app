import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

import logo from '../assets/icon.png';
import abstractBg from '../assets/right-column.png';
import { registerUser } from '../services/api';
import axios from 'axios';

const SignupPage: React.FC = () => {

  const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

   const validateName = (name: string) => {
    // Name must contain only letters and spaces
    return /^[A-Za-z\s]+$/.test(name.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!name) {
    setError('Name is required.');
    return;
  }

  if (!validateName(name)) {
    setError('Name must contain only letters and spaces.');
    return;
  }

  if (!dob) {
    setError('Date of Birth is required.');
    return;
  }

  if (!email) {
    setError('Email is required.');
    return;
  }

  setLoading(true);

  try {
    const formattedDob = dob ? format(dob, 'yyyy-MM-dd') : '';

    await registerUser({ name, email, dob: formattedDob });

    // On success navigate to OTP verification page
    navigate('/verify-otp', { state: { email } });
  } catch (err: unknown) {
    console.error('Signup error:', err);

    if (axios.isAxiosError(err) && err.response) {
      const message =
        (err.response.data && (err.response.data.message || err.response.data.error)) ||
        'An error occurred';

      if (typeof message === 'string') {
        const msgLower = message.toLowerCase();
        if (msgLower.includes('account with the email already exists')) {
          setError('Account with the email already exists.');
        } else if (msgLower.includes('otp') || msgLower.includes('verify')) {
          setError('There was an error sending OTP. Please try again.');
        } else {
          setError(message);
        }
      } else {
        setError('An unknown error occurred.');
      }
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unknown error occurred.');
    }
  } finally {
    setLoading(false);
  }
};
      const handleGoogleSignIn = () => {

    const API_ROOT_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    const googleAuthUrl = `${API_ROOT_URL}/api/users/google`;
    
    window.location.href = googleAuthUrl;
  };

  return (
    <>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
      <div className="min-h-screen w-full lg:grid lg:grid-cols-12">
        <div className="lg:col-span-5 relative flex flex-col justify-center bg-white px-6 pt-12 pb-6 lg:px-8">
          <div className="hidden lg:block absolute top-8 left-8">
            <div className="flex items-center gap-2">
              <img className="h-8 w-auto" src={logo} alt="HD Logo" />
              <span className="text-2xl font-bold">HD</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <div className="lg:hidden flex items-center gap-2 justify-center">
              <img className="h-8 w-auto" src={logo} alt="HD Logo" />
              <span className="text-2xl font-bold">HD</span>
            </div>
            <div className="mt-8">
              <h2 className="text-3xl lg:text-4xl font-bold leading-9 tracking-tight text-gray-900">
                Sign up
              </h2>
              <p className="mt-2 text-sm lg:text-lg leading-6 text-gray-500">
                Sign up to enjoy the feature of HD
              </p>
            </div>
            <div className="mt-10">
              <form className="space-y-8" onSubmit={handleSubmit}>
                
                {/* Name Input */}
                <div className="relative group">
                  <label
                    htmlFor="name"
                    className="absolute -top-2.5 left-2 z-10 inline-block bg-white px-1 text-sm font-medium text-gray-600 group-focus-within:text-blue-600"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jonas Khanwald"
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                  />
                </div>

                 {/* Date of Birth Input*/}
            <div className="relative group">
              <label
                htmlFor="dob"
                className="absolute -top-2.5 left-2 z-10 inline-block bg-white px-1 text-sm font-medium text-gray-600 group-focus-within:text-blue-600"
              >
                Date of Birth
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <DatePicker
                  id="dob"
                  selected={dob}
                  onChange={date => setDob(date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="11 December 1997"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                  popperClassName="custom-calendar-pop"
                  portalId="calendar-portal"
                  autoComplete="off"
                  onKeyDown={(e) => e.preventDefault()}
                />
              </div>
            </div>

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
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jonas_kahnwald@gmail.com"
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm lg:text-lg font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
                  >
                    {loading ? 'Sending...' : 'Get OTP'}
                  </button>
                </div>
              </form>

              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-sm text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm lg:text-lg font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <GoogleIcon />
                  Sign in with Google
                </button>
              </div>

              <p className="mt-10 text-center text-sm lg:text-lg text-gray-500">
                Already have an account??{' '}
                <a href="/signin" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-7">
          <img
            className="h-full w-full object-cover"
            src={abstractBg}
            alt="Abstract background"
          />
        </div>
      </div>
    </>
  );
};

export default SignupPage;