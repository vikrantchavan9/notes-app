import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
      <p className="mt-2 text-gray-600">Your email is: {user?.email}</p>
      <button 
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Your Notes</h2>
        <p className="mt-4">Your notes will appear here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;