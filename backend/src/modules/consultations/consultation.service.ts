import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';

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
                query = `
                    SELECT c.*, p.name as patient_name 
                    FROM consultations c 
                    LEFT JOIN users p ON c.patient_id = p.id 
                    WHERE c.doctor_id = ? OR c.status = 'REQUESTED' 
                    ORDER BY c.created_at DESC`;
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
                     WHERE c.doctor_id = ?
                     ORDER BY c.created_at DESC
                `;
            } else {
                return resolve([]); // Other roles don't have consults in this simple model
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
                return reject(new AppError('Invalid status', 400));
            }

            // First check if consultation exists and if doctor can update it
            // For simplicity, any doctor can "take" a REQUESTED consult, or update one they own.

            db.get('SELECT * FROM consultations WHERE id = ?', [consultationId], (err, row: any) => {
                if (err) return reject(new AppError('Database error', 500));
                if (!row) return reject(new AppError('Consultation not found', 404));

                // Logic: If status is REQUESTED, Doctor can take it (become doctor_id) and set to ACTIVE
                // If already assigned, only assigned doctor can update.

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
                        resolve({ ...row, status, doctor_id: newDoctorId });
                    }
                );
            });
        });
    }
}
