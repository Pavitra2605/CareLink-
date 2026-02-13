import { Response, NextFunction } from 'express';
import { RecordService } from './records.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class RecordController {

    static async createRecord(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await RecordService.createRecord(req.user.id, req.body);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getRecords(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { patientId } = req.params;
            const result = await RecordService.getPatientRecords(patientId, req.user.id, req.user.role);
            res.status(200).json({
                status: 'success',
                results: result.length,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
