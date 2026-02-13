import express from 'express';
import { RecordController } from './records.controller';
import { protect } from '../../middleware/auth.middleware';
import { restrictTo } from '../../middleware/role.middleware';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('DOCTOR'), RecordController.createRecord);
router.get('/:patientId', RecordController.getRecords);

export default router;
