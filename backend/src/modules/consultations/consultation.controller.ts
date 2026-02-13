import { Response, NextFunction } from 'express';
import { ConsultationService } from './consultation.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ConsultationController {

    static async request(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await ConsultationService.requestConsultation(req.user.id, req.body);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMyConsultations(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await ConsultationService.getMyConsultations(req.user.id, req.user.role);
            res.status(200).json({
                status: 'success',
                results: result.length,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await ConsultationService.updateStatus(id, req.user.id, status);
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
