import express from 'express';
import { EmergencyController } from './emergency.controller';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { triggerEmergencySchema } from '../../schemas/emergency.schema';
import { criticalLimiter } from '../../middleware/rateLimit.middleware';

const router = express.Router();

router.use(protect);

router.post('/', criticalLimiter, validate(triggerEmergencySchema), EmergencyController.trigger);
router.get('/me', EmergencyController.getMyEvents);

export default router;
