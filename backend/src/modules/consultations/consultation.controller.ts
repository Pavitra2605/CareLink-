import { Response, NextFunction } from 'express';
import { ConsultationService } from './consultation.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { AppError } from '../../middleware/error.middleware';
import { AuditService } from '../audit/audit.service';

export class ConsultationController {

    static async request(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await ConsultationService.requestConsultation(req.user.id, req.body);
            res.status(201).json({
                success: true,
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
                success: true,
                count: result.length,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /consultations/queue
     * Doctor queue view - prioritized consultations
     */
    static async getQueue(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // Only doctors can access queue
            if (req.user.role !== 'DOCTOR') {
                return next(new AppError('Only doctors can access the consultation queue', 403));
            }

            const queue = await ConsultationService.getDoctorQueue();

            // Log queue access
            AuditService.log(req.user.id, 'VIEW_CONSULTATION_QUEUE', 'QUEUE', `QUEUE-${req.user.id}`, 
                `Doctor viewed consultation queue. ${queue.length} consultations available.`, '');

            res.status(200).json({
                success: true,
                count: queue.length,
                data: queue
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
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
