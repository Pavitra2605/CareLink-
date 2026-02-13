import { Response, NextFunction } from 'express';
import { EmergencyService } from './emergency.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class EmergencyController {

    static async trigger(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await EmergencyService.triggerEmergency(req.user.id, req.body);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMyEvents(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await EmergencyService.getMyEmergencyEvents(req.user.id);
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
