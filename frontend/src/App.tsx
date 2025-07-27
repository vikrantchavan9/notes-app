import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/Signup';
import OtpPage from './pages/OtpPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpPage />} /> {/* Add the new route */}
        {/* We will add the dashboard and other routes later */}
        <Route path="/" element={<SignupPage />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;