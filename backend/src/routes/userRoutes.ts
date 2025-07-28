import { Router } from 'express';
import { registerUser, verifyOtp, loginUser } from '../controllers/userController';
import passport from 'passport';
import generateToken from '../utils/generateToken';
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

const router = Router();

// --- Email & OTP Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser); 
router.post('/verify-otp', verifyOtp);

// --- Google OAuth Routes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed', session: false }),
  (req, res) => {
    const user = req.user as IUser;
    
    const token = generateToken(user);
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/google-auth-callback?token=${token}`);
  }
);

export default router;
