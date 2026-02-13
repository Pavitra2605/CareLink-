import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';
import { AuditService } from '../audit/audit.service';

export class TriageService {

    static async createTriageLog(userId: string, triageData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const { symptoms, severity } = triageData;

            if (!symptoms || !severity) {
                return reject(new AppError('Please provide symptoms and severity', 400));
            }

            let recommended_action = '';
            switch (severity) {
                case 'LOW':
                    recommended_action = 'Home Care';
                    break;
                case 'MEDIUM':
                    recommended_action = 'Consult Doctor';
                    break;
                case 'HIGH':
                    recommended_action = 'Emergency';
                    break;
                default:
                    return reject(new AppError('Invalid severity level. Must be LOW, MEDIUM, or HIGH', 400));
            }

            const triageId = uuidv4();

            db.run(
                'INSERT INTO triage_logs (id, user_id, symptoms, severity, recommended_action) VALUES (?, ?, ?, ?, ?)',
                [triageId, userId, symptoms, severity, recommended_action],
                (err) => {
                    if (err) return reject(new AppError('Error creating triage log', 500));

                    // Auto-escalate to emergency if HIGH severity
                    if (severity === 'HIGH') {
                        TriageService.autoEscalateEmergency(userId, triageId, symptoms);
                    }

                    // Log the triage creation
                    AuditService.log(userId, 'CREATE_TRIAGE', 'TRIAGE', triageId, `Severity: ${severity}`, '');

                    resolve({
                        id: triageId,
                        user_id: userId,
                        symptoms,
                        severity,
                        recommended_action,
                        created_at: new Date(),
                        autoEscalated: severity === 'HIGH'
                    });
                }
            );
        });
    }

    /**
     * Automatically creates emergency event for HIGH severity triage
     * Fire-and-forget to avoid blocking response
     */
    private static autoEscalateEmergency(patientId: string, triageId: string, symptoms: string) {
        const emergencyId = uuidv4();
        
        db.run(
            'INSERT INTO emergency_events (id, patient_id, triage_id, status, description) VALUES (?, ?, ?, ?, ?)',
            [emergencyId, patientId, triageId, 'TRIGGERED', `Auto-escalated from HIGH severity triage: ${symptoms}`],
            (err) => {
                if (err) {
                    console.error('Error auto-escalating to emergency:', err.message);
                } else {
                    // Log the auto-escalation
                    AuditService.log('SYSTEM', 'AUTO_ESCALATE_EMERGENCY', 'EMERGENCY', emergencyId, 
                        `Auto-escalated from triage ${triageId}`, '');
                }
            }
        );
    }

    static async getMyTriageLogs(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM triage_logs WHERE user_id = ? ORDER BY created_at DESC',
                [userId],
                (err, rows) => {
                    if (err) return reject(new AppError('Database error', 500));
                    resolve(rows || []);
                }
            );
        });
    }

    /**
     * Get latest triage for a user
     */
    static async getLatestTriage(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM triage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
                [userId],
                (err, row) => {
                    if (err) return reject(new AppError('Database error', 500));
                    resolve(row || null);
                }
            );
        });
    }

    /**
     * Map severity to priority level
     */
    static mapSeverityToPriority(severity: string): number {
        switch (severity) {
            case 'HIGH':
                return 1;
            case 'MEDIUM':
                return 2;
            case 'LOW':
            default:
                return 3;
        }
    }
}
