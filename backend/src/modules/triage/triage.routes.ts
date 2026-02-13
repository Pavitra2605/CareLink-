import express from 'express';
import { TriageController } from './triage.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', TriageController.submitTriage);
router.get('/me', TriageController.getMyTriage);

export default router;
