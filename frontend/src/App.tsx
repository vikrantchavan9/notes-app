import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';
import OtpPage from './pages/OtpPage'; 
import DashboardPage from './pages/DashboardPage'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<SignupPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;