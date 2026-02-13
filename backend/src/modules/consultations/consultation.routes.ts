import express from 'express';
import { ConsultationController } from './consultation.controller';
import { protect } from '../../middleware/auth.middleware';
import { restrictTo } from '../../middleware/role.middleware';

const router = express.Router();

router.use(protect);

router.post('/request', restrictTo('PATIENT'), ConsultationController.request);
router.get('/me', ConsultationController.getMyConsultations);
router.patch('/:id/status', restrictTo('DOCTOR'), ConsultationController.updateStatus);

export default router;
