import { Router } from 'express';
import { registerUser, verifyOtp } from '../controllers/userController';
import passport from 'passport'; 
import generateToken from '../utils/generateToken';
import { IUser } from '../models/User';

const router = Router();

// Route for /api/users/register
router.post('/register', registerUser);

// OTP verification route
router.post('/verify-otp', verifyOtp);

// --- Google OAuth Routes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed', session: false }), // We use session: false as we are using JWTs
  (req, res) => {

    const user = req.user as IUser;
    const token = generateToken(user._id.toString());
    
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

export default router;