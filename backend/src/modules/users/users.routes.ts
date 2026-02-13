import express from 'express';
import { UserController } from './users.controller';
import { protect } from '../../middleware/auth.middleware';
import { restrictTo } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createPatientProfileSchema } from '../../schemas/user.schema';

const router = express.Router();

// Get own profile (Any authenticated user can technically get their basic info, but usually patient profile specific)
// Allowing all for now to view their joined data
router.get('/me', protect, UserController.getProfile);

// Create patient profile - restricted to PATIENT role with validation
router.post('/profile', protect, restrictTo('PATIENT'), validate(createPatientProfileSchema), UserController.createProfile);

export default router;
