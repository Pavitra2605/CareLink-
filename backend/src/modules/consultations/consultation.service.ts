import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';
import { AuditService } from '../audit/audit.service';
import { TriageService } from '../triage/triage.service';

export class ConsultationService {

    /**
     * Request consultation with automatic priority assignment from latest triage
     */
    static async requestConsultation(patientId: string, consultationData: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const { notes } = consultationData;

            try {
                // Fetch latest triage to get severity and assign priority
                const latestTriage = await TriageService.getLatestTriage(patientId);
                
                let priority = 3; // Default to LOW (Priority 3)
                if (latestTriage) {
                    priority = TriageService.mapSeverityToPriority(latestTriage.severity);
                }

                const id = uuidv4();
                const status = 'REQUESTED';

                db.run(
                    'INSERT INTO consultations (id, patient_id, status, notes, priority) VALUES (?, ?, ?, ?, ?)',
                    [id, patientId, status, notes, priority],
                    function (err) {
                        if (err) return reject(new AppError('Error requesting consultation', 500));

                        AuditService.log(patientId, 'REQUEST_CONSULTATION', 'CONSULTATION', id, 
                            `Notes: ${notes}, Priority: ${priority}`, '');

                        resolve({
                            id,
                            patient_id: patientId,
                            status,
                            priority,
                            priority_name: ConsultationService.getPriorityName(priority),
                            notes,
                            created_at: new Date()
                        });
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    static async getMyConsultations(userId: string, role: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let query = '';
            let params = [userId];

            if (role === 'PATIENT') {
                query = `
                    SELECT c.*, d.name as doctor_name 
                    FROM consultations c 
                    LEFT JOIN users d ON c.doctor_id = d.id 
                    WHERE c.patient_id = ? 
                    ORDER BY c.priority ASC, c.created_at DESC`;
            } else if (role === 'DOCTOR') {
                params = [userId];
                query = `
                     SELECT c.*, u.name as patient_name 
                     FROM consultations c 
                     LEFT JOIN users u ON c.patient_id = u.id
                     WHERE c.doctor_id = ? OR c.status = 'REQUESTED'
                     ORDER BY c.priority ASC, c.created_at DESC
                `;
            } else {
                return resolve([]);
            }

            db.all(query, params, (err, rows) => {
                if (err) return reject(new AppError('Database error', 500));
                resolve(rows || []);
            });
        });
    }

    /**
     * Get doctor queue sorted by priority and time
     * Only DOCTOR role can access
     */
    static async getDoctorQueue(): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    c.id,
                    c.patient_id,
                    c.priority,
                    c.status,
                    c.requested_time,
                    c.created_at as requested_time,
                    u.name as patient_name,
                    t.severity,
                    t.symptoms,
                    t.recommended_action
                FROM consultations c
                LEFT JOIN users u ON c.patient_id = u.id
                LEFT JOIN (
                    SELECT user_id, severity, symptoms, recommended_action, created_at
                    FROM triage_logs
                    WHERE (user_id, created_at) IN (
                        SELECT user_id, MAX(created_at)
                        FROM triage_logs
                        GROUP BY user_id
                    )
                ) t ON c.patient_id = t.user_id
                WHERE c.status = 'REQUESTED'
                ORDER BY c.priority ASC, c.created_at ASC
            `;

            db.all(query, [], (err, rows: any) => {
                if (err) return reject(new AppError('Database error', 500));
                
                const queue = (rows || []).map((row: any) => ({
                    consultation_id: row.id,
                    patient_id: row.patient_id,
                    patient_name: row.patient_name,
                    priority: row.priority,
                    priority_name: ConsultationService.getPriorityName(row.priority),
                    severity: row.severity || 'UNKNOWN',
                    symptoms: row.symptoms,
                    recommended_action: row.recommended_action,
                    requested_at: row.requested_time,
                    status: row.status
                }));

                resolve(queue);
            });
        });
    }

    /**
     * Update consultation status with strict state machine
     */
    static async updateStatus(consultationId: string, doctorId: string, status: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const allowedStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED'];
            if (!allowedStatuses.includes(status)) {
                return reject(new AppError('Invalid desired status', 400));
            }

            db.get('SELECT * FROM consultations WHERE id = ?', [consultationId], (err, row: any) => {
                if (err) return reject(new AppError('Database error', 500));
                if (!row) return reject(new AppError('Consultation not found', 404));

                const currentStatus = row.status;

                // Strict State Machine
                let isValidTransition = false;
                if (currentStatus === 'REQUESTED' && status === 'ACTIVE') isValidTransition = true;
                if (currentStatus === 'ACTIVE' && status === 'COMPLETED') isValidTransition = true;
                if (currentStatus === 'REQUESTED' && status === 'CANCELLED') isValidTransition = true;

                if (!isValidTransition) {
                    return reject(new AppError(`Invalid status transition from ${currentStatus} to ${status}`, 400));
                }

                let newDoctorId = row.doctor_id;
                if (row.status === 'REQUESTED' && status === 'ACTIVE') {
                    newDoctorId = doctorId;
                } else if (row.doctor_id && row.doctor_id !== doctorId) {
                    return reject(new AppError('You are not assigned to this consultation', 403));
                }

                db.run(
                    'UPDATE consultations SET status = ?, doctor_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [status, newDoctorId, consultationId],
                    function (err) {
                        if (err) return reject(new AppError('Error updating consultation', 500));

                        AuditService.log(doctorId, 'UPDATE_STATUS', 'CONSULTATION', consultationId, 
                            `Status: ${currentStatus} → ${status}`, '');

                        resolve({ 
                            ...row, 
                            status, 
                            doctor_id: newDoctorId,
                            priority_name: ConsultationService.getPriorityName(row.priority)
                        });
                    }
                );
            });
        });
    }

    /**
     * Get consultation by ID
     */
    static async getConsultationById(consultationId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT c.*, u.name as patient_name, d.name as doctor_name 
                 FROM consultations c 
                 LEFT JOIN users u ON c.patient_id = u.id
                 LEFT JOIN users d ON c.doctor_id = d.id
                 WHERE c.id = ?`,
                [consultationId],
                (err, row: any) => {
                    if (err) return reject(new AppError('Database error', 500));
                    if (!row) return reject(new AppError('Consultation not found', 404));
                    
                    const consultation = { ...row };
                    consultation.priority_name = ConsultationService.getPriorityName(row.priority);
                    resolve(consultation);
                }
            );
        });
    }

    /**
     * Helper: Map priority number to name
     */
    private static getPriorityName(priority: number): string {
        switch (priority) {
            case 1:
                return 'HIGH';
            case 2:
                return 'MEDIUM';
            case 3:
            default:
                return 'LOW';
        }
    }
}
