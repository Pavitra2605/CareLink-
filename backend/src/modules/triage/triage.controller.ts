import { Response, NextFunction } from 'express';
import { TriageService } from './triage.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class TriageController {

    static async submitTriage(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await TriageService.createTriageLog(req.user.id, req.body);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMyTriage(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await TriageService.getMyTriageLogs(req.user.id);
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
