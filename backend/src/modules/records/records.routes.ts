import express from 'express';
import { RecordController } from './records.controller';
import { protect } from '../../middleware/auth.middleware';
import { restrictTo } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createRecordSchema } from '../../schemas/records.schema';

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('DOCTOR'), validate(createRecordSchema), RecordController.createRecord);
router.get('/:patientId', RecordController.getRecords);

export default router;
