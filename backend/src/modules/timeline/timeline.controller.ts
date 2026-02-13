import { Request, Response, NextFunction } from 'express';
import { TimelineService } from './timeline.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { AppError } from '../../middleware/error.middleware';

export class TimelineController {

    /**
     * GET /patients/:id/timeline
     * Accessible by: PATIENT (own), DOCTOR (assigned), ADMIN
     */
    static async getPatientTimeline(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const patientId = req.params.id;
            const userId = req.user.id;
            const role = req.user.role;

            // Access control
            if (role === 'PATIENT' && userId !== patientId) {
                return next(new AppError('Cannot access other patient timelines', 403));
            }

            if (role === 'DOCTOR') {
                // Check if doctor has active consultation with this patient
                const hasAccess = await TimelineController.doctorCanAccessPatient(userId, patientId);
                if (!hasAccess) {
                    return next(new AppError('You are not assigned to this patient', 403));
                }
            }

            if (!['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN'].includes(role)) {
                return next(new AppError('Insufficient permissions', 403));
            }

            const timeline = await TimelineService.getPatientTimeline(patientId);
            const summary = await TimelineService.getTimelineSummary(patientId);

            res.status(200).json({
                success: true,
                data: {
                    timeline,
                    summary
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Helper: Check if doctor is assigned to patient
     */
    private static doctorCanAccessPatient(doctorId: string, patientId: string): Promise<boolean> {
        return new Promise((resolve) => {
            const db = require('../../config/database').default;
            db.get(
                'SELECT id FROM consultations WHERE doctor_id = ? AND patient_id = ? LIMIT 1',
                [doctorId, patientId],
                (err: any, row: any) => {
                    resolve(!err && !!row);
                }
            );
        });
    }
}
