import express from 'express';
import { AuthController } from './auth.controller';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../../schemas/auth.schema';
import { authLimiter } from '../../middleware/rateLimit.middleware';

const router = express.Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.get('/me', protect, AuthController.getMe);

export default router;
