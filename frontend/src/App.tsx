import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/Signup';
import SigninPage from './pages/SignIn';
import { AuthProvider } from './contexts/AuthProvider';
import OtpPage from './pages/OtpPage'; 
import DashboardPage from './pages/DashboardPage'; 
import ProtectedRoute from './components/ProtectedRoute';
import GoogleAuthCallback from './pages/GoogleAuthCallback';

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/google-auth-callback" element={<GoogleAuthCallback />} /> 
          
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