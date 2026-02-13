import db from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

/**
 * Analytics Service
 * Provides admin dashboard metrics
 */
export class AnalyticsService {

    /**
     * Get comprehensive admin metrics
     */
    static async getMetrics(): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT COUNT(*) FROM users WHERE role = 'PATIENT') as total_patients,
                    (SELECT COUNT(*) FROM users WHERE role = 'DOCTOR') as total_doctors,
                    (SELECT COUNT(*) FROM consultations) as total_consultations,
                    (SELECT COUNT(*) FROM consultations WHERE status = 'REQUESTED') as pending_consultations,
                    (SELECT COUNT(*) FROM consultations WHERE status = 'ACTIVE') as active_consultations,
                    (SELECT COUNT(*) FROM emergency_events WHERE status = 'TRIGGERED') as active_emergencies,
                    (SELECT COUNT(*) FROM emergency_events WHERE status = 'IN_PROGRESS') as in_progress_emergencies,
                    (SELECT COUNT(*) FROM triage_logs WHERE severity = 'LOW') as low_severity_triages,
                    (SELECT COUNT(*) FROM triage_logs WHERE severity = 'MEDIUM') as medium_severity_triages,
                    (SELECT COUNT(*) FROM triage_logs WHERE severity = 'HIGH') as high_severity_triages,
                    (SELECT COUNT(*) FROM medical_records) as total_records,
                    (SELECT COUNT(*) FROM triage_logs) as total_triage_logs
            `;

            db.get(query, [], (err, row: any) => {
                if (err) {
                    console.error('Analytics query error:', err);
                    return reject(new AppError('Database error', 500));
                }

                // Build response with grouped metrics
                const metrics = {
                    users: {
                        total: row?.total_users || 0,
                        patients: row?.total_patients || 0,
                        doctors: row?.total_doctors || 0
                    },
                    consultations: {
                        total: row?.total_consultations || 0,
                        pending: row?.pending_consultations || 0,
                        active: row?.active_consultations || 0
                    },
                    emergencies: {
                        active: row?.active_emergencies || 0,
                        in_progress: row?.in_progress_emergencies || 0
                    },
                    triage: {
                        total: row?.total_triage_logs || 0,
                        bySeverity: {
                            LOW: row?.low_severity_triages || 0,
                            MEDIUM: row?.medium_severity_triages || 0,
                            HIGH: row?.high_severity_triages || 0
                        }
                    },
                    medical_records: {
                        total: row?.total_records || 0
                    },
                    timestamp: new Date().toISOString()
                };

                resolve(metrics);
            });
        });
    }

    /**
     * Get consultation metrics
     */
    static async getConsultationMetrics(): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    priority,
                    COUNT(*) as count,
                    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed,
                    COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active,
                    COUNT(CASE WHEN status = 'REQUESTED' THEN 1 END) as requested
                FROM consultations
                GROUP BY priority
                ORDER BY priority ASC
            `;

            db.all(query, [], (err, rows) => {
                if (err) return reject(new AppError('Database error', 500));
                
                const metrics = (rows || []).map((row: any) => ({
                    priority: row.priority,
                    priority_name: AnalyticsService.getPriorityName(row.priority),
                    total: row.count,
                    completed: row.completed,
                    active: row.active,
                    requested: row.requested
                }));

                resolve(metrics);
            });
        });
    }

    /**
     * Get doctor activity metrics
     */
    static async getDoctorMetrics(): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    u.id,
                    u.name,
                    COUNT(c.id) as total_consultations,
                    COUNT(CASE WHEN c.status = 'COMPLETED' THEN 1 END) as completed_consultations,
                    COUNT(CASE WHEN c.status = 'ACTIVE' THEN 1 END) as active_consultations,
                    COUNT(mr.id) as total_records
                FROM users u
                LEFT JOIN consultations c ON u.id = c.doctor_id
                LEFT JOIN medical_records mr ON u.id = mr.doctor_id
                WHERE u.role = 'DOCTOR'
                GROUP BY u.id, u.name
                ORDER BY total_consultations DESC
            `;

            db.all(query, [], (err, rows) => {
                if (err) return reject(new AppError('Database error', 500));
                resolve(rows || []);
            });
        });
    }

    /**
     * Get patient engagement metrics
     */
    static async getPatientEngagementMetrics(): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    COUNT(DISTINCT u.id) as total_patients,
                    COUNT(DISTINCT CASE WHEN c.id IS NOT NULL THEN u.id END) as patients_with_consultations,
                    COUNT(DISTINCT CASE WHEN t.id IS NOT NULL THEN u.id END) as patients_with_triage,
                    COUNT(DISTINCT CASE WHEN e.id IS NOT NULL THEN u.id END) as patients_with_emergency,
                    COUNT(DISTINCT CASE WHEN mr.id IS NOT NULL THEN u.id END) as patients_with_records
                FROM users u
                LEFT JOIN consultations c ON u.id = c.patient_id
                LEFT JOIN triage_logs t ON u.id = t.user_id
                LEFT JOIN emergency_events e ON u.id = e.patient_id
                LEFT JOIN medical_records mr ON u.id = mr.patient_id
                WHERE u.role = 'PATIENT'
            `;

            db.get(query, [], (err, row) => {
                if (err) return reject(new AppError('Database error', 500));
                resolve(row);
            });
        });
    }

    /**
     * Helper: Map priority to name
     */
    private static getPriorityName(priority: number): string {
        switch (priority) {
            case 1:
                return 'HIGH';
            case 2:
                return 'MEDIUM';
            case 3:
                return 'LOW';
            default:
                return 'UNKNOWN';
        }
    }
}
