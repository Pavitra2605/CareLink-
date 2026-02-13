import express from 'express';
import { TimelineController } from './timeline.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

/**
 * GET /patients/:id/timeline
 * Get complete patient timeline (triage, consultations, records, emergencies)
 * Accessible by: PATIENT (own), DOCTOR (assigned), ADMIN
 */
router.get('/:id', TimelineController.getPatientTimeline);

export default router;
