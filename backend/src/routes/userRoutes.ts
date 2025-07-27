import { Router } from 'express';
import { registerUser } from '../controllers/userController';

const router = Router();

// Route for /api/users/register
router.post('/register', registerUser);

export default router;