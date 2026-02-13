import express from 'express';
import { AuthController } from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', protect, AuthController.getMe);

export default router;
