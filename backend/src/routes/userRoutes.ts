import { Router } from 'express';
import { registerUser, verifyOtp } from '../controllers/userController';

const router = Router();

// Route for /api/users/register
router.post('/register', registerUser);

// OTP verification route
router.post('/verify-otp', verifyOtp);

export default router;