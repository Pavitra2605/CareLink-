import express from 'express';
import { EmergencyController } from './emergency.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', EmergencyController.trigger);
router.get('/me', EmergencyController.getMyEvents);

export default router;
