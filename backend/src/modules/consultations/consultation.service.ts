import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';
import { AuditService } from '../audit/audit.service';

export class ConsultationService {

    static async requestConsultation(patientId: string, consultationData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const { notes } = consultationData; // doctor_id might be optional or assigned later

            const id = uuidv4();
            const status = 'REQUESTED';

            db.run(
                'INSERT INTO consultations (id, patient_id, status, notes) VALUES (?, ?, ?, ?)',
                [id, patientId, status, notes],
                function (err) {
                    if (err) return reject(new AppError('Error requesting consultation', 500));

                    AuditService.log(patientId, 'REQUEST_CONSULTATION', 'CONSULTATION', id, `Notes: ${notes}`);

                    resolve({ id, patient_id: patientId, status, notes, created_at: new Date() });
                }
            );
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
                    ORDER BY c.created_at DESC`;
            } else if (role === 'DOCTOR') {
                // Doctors see their assignments OR unassigned requests (simplified logic)
                // Actually, let's just show all for doctor for now or assigned. 
                // Creating a simplified view: Doctors see logic where they are assigned.
                // To pick up requests, they might need a separate endpoint or param.
                // For this demo: Doctors see everything if they are admin, but here regular doctor context.
                // Let's stick to "My Consultations".
                // If doctor_id is null, it's open.
                params = [userId];
                query = `
                     SELECT c.*, u.name as patient_name 
                     FROM consultations c 
                     LEFT JOIN users u ON c.patient_id = u.id
                     WHERE c.doctor_id = ? OR c.status = 'REQUESTED'
                     ORDER BY c.created_at DESC
                `;
            } else {
                // Other roles logic... for strictness, maybe empty or specific
                return resolve([]);
            }

            db.all(query, params, (err, rows) => {
                if (err) return reject(new AppError('Database error', 500));
                resolve(rows);
            });
        });
    }

    static async updateStatus(consultationId: string, doctorId: string, status: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const allowedStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED'];
            if (!allowedStatuses.includes(status)) {
                return reject(new AppError('Invalid desired status', 400));
            }

            // First check if consultation exists and if doctor can update it
            // For simplicity, any doctor can "take" a REQUESTED consult, or update one they own.

            // Transaction-like check
            db.get('SELECT * FROM consultations WHERE id = ?', [consultationId], (err, row: any) => {
                if (err) return reject(new AppError('Database error', 500));
                if (!row) return reject(new AppError('Consultation not found', 404));

                const currentStatus = row.status;

                // Strict State Machine
                // REQUESTED -> ACTIVE -> COMPLETED
                // REQUESTED -> CANCELLED

                let isValidTransition = false;
                if (currentStatus === 'REQUESTED' && status === 'ACTIVE') isValidTransition = true;
                if (currentStatus === 'ACTIVE' && status === 'COMPLETED') isValidTransition = true;
                if (currentStatus === 'REQUESTED' && status === 'CANCELLED') isValidTransition = true;
                // Maybe allow ACTIVE -> CANCELLED too? Let's stick to prompt: "REQUESTED -> CANCELLED"

                if (!isValidTransition) {
                    return reject(new AppError(`Invalid status transition from ${currentStatus} to ${status}`, 400));
                }

                let newDoctorId = row.doctor_id;
                if (row.status === 'REQUESTED' && status === 'ACTIVE') {
                    newDoctorId = doctorId; // Assign doctor
                } else if (row.doctor_id && row.doctor_id !== doctorId) {
                    return reject(new AppError('You are not assigned to this consultation', 403));
                }

                db.run(
                    'UPDATE consultations SET status = ?, doctor_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [status, newDoctorId, consultationId],
                    function (err) {
                        if (err) return reject(new AppError('Error updating consultation', 500));

                        AuditService.log(doctorId, 'UPDATE_STATUS', 'CONSULTATION', consultationId, `New Status: ${status}`);

                        resolve({ ...row, status, doctor_id: newDoctorId });
                    }
                );
            });
        });
    }
}
