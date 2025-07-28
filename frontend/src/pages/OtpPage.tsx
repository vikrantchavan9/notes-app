import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../services/api'; 
import { useAuth } from '../hooks/useAuth';

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, token } = useAuth(); 
  const email = location.state?.email;

   // This effect will run whenever the 'token' value changes.
  useEffect(() => {
    // If a token becomes available, it means login was successful.
    if (token) {
      navigate('/dashboard', { replace: true }); // Navigate to the dashboard
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setLoading(true);

    try {
      const data = await verifyOtp(email, otp);

            // --- DEBUGGING STEP 1: Check the API response ---
      console.log('API Response received in OtpPage:', data);
      
      login(data.token, false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Enter Verification Code</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          A 6-digit code has been sent to <span className="font-medium text-gray-900">{email}</span>
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="sr-only">OTP</label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="block w-full text-center text-2xl tracking-[1em] p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="------"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;