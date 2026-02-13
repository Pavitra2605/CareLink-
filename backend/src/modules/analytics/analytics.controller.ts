import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { AppError } from '../../middleware/error.middleware';

export class AnalyticsController {

    /**
     * GET /admin/metrics
     * Accessible by: SYSTEM_ADMIN, HOSPITAL_ADMIN only
     */
    static async getMetrics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const role = req.user.role;

            // Restrict to admin roles
            if (!['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(role)) {
                return next(new AppError('Insufficient permissions. Only admins can access metrics.', 403));
            }

            const metrics = await AnalyticsService.getMetrics();

            res.status(200).json({
                success: true,
                data: metrics
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /admin/metrics/consultations
     * Get consultation breakdown by priority
     */
    static async getConsultationMetrics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const role = req.user.role;

            if (!['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(role)) {
                return next(new AppError('Insufficient permissions', 403));
            }

            const metrics = await AnalyticsService.getConsultationMetrics();

            res.status(200).json({
                success: true,
                data: {
                    consultation_distribution: metrics
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /admin/metrics/doctors
     * Get doctor activity metrics
     */
    static async getDoctorMetrics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const role = req.user.role;

            if (!['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(role)) {
                return next(new AppError('Insufficient permissions', 403));
            }

            const metrics = await AnalyticsService.getDoctorMetrics();

            res.status(200).json({
                success: true,
                data: {
                    doctors: metrics
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /admin/metrics/patients
     * Get patient engagement metrics
     */
    static async getPatientMetrics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const role = req.user.role;

            if (!['SYSTEM_ADMIN', 'HOSPITAL_ADMIN'].includes(role)) {
                return next(new AppError('Insufficient permissions', 403));
            }

            const metrics = await AnalyticsService.getPatientEngagementMetrics();

            res.status(200).json({
                success: true,
                data: {
                    patient_engagement: metrics
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
