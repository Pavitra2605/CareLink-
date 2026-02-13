import express from 'express';
import { TriageController } from './triage.controller';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createTriageSchema } from '../../schemas/triage.schema';
import { criticalLimiter } from '../../middleware/rateLimit.middleware';

const router = express.Router();

router.use(protect);

router.post('/', criticalLimiter, validate(createTriageSchema), TriageController.submitTriage);
router.get('/me', TriageController.getMyTriage);

export default router;
