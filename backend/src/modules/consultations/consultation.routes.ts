import express from 'express';
import { ConsultationController } from './consultation.controller';
import { protect } from '../../middleware/auth.middleware';
import { restrictTo } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { requestConsultationSchema, updateConsultationStatusSchema } from '../../schemas/consultation.schema';

const router = express.Router();

router.use(protect);

router.post('/request', restrictTo('PATIENT'), validate(requestConsultationSchema), ConsultationController.request);
router.get('/queue', restrictTo('DOCTOR'), ConsultationController.getQueue);
router.get('/me', ConsultationController.getMyConsultations);
router.patch('/:id/status', restrictTo('DOCTOR'), validate(updateConsultationStatusSchema), ConsultationController.updateStatus);

export default router;
