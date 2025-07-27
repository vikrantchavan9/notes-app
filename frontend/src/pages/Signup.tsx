import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Calendar } from 'lucide-react';
import logo from '../assets/icon.png'; 
import abstractBg from '../assets/right-column.png';
import { registerUser } from 'backend/src/services/api.ts';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState(''); 
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setLoading(true);

    if (!name || !dob || !email) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser({ name, email, dob });
      console.log(data.message); 
      navigate('/verify-otp', { state: { email } });
    } catch (err: any) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
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

                {/* Date of Birth Input */}
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
                    <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                    />
                  </div>
                </div>

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
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jonas_kahnwald@gmail.com"
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-2 ring-inset ring-blue-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-lg"
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm lg:text-lg font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Get OTP
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm lg:text-lg text-gray-500">
                Already have an account??{' '}
                <a href="#" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
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