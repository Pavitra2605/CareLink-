import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';

export class RecordService {

    static async createRecord(doctorId: string, recordData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const { patient_id, diagnosis, prescription, notes } = recordData;

            if (!patient_id || !diagnosis) {
                return reject(new AppError('Patient ID and Diagnosis are required', 400));
            }

            const id = uuidv4();

            db.run(
                'INSERT INTO medical_records (id, patient_id, doctor_id, diagnosis, prescription, notes) VALUES (?, ?, ?, ?, ?, ?)',
                [id, patient_id, doctorId, diagnosis, prescription, notes],
                function (err) {
                    if (err) return reject(new AppError('Error creating medical record', 500));
                    resolve({
                        id,
                        patient_id,
                        doctor_id: doctorId,
                        diagnosis,
                        prescription,
                        notes,
                        created_at: new Date()
                    });
                }
            );
        });
    }

    static async getPatientRecords(patientId: string, requestorId: string, requestorRole: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Access Control: 
            // - Patient can see their own records
            // - Doctor can see any patient's records (in this simplified model)
            // - Other roles might be restricted

            if (requestorRole === 'PATIENT' && requestorId !== patientId) {
                return reject(new AppError('You are not authorized to view these records', 403));
            }

            db.all(
                `SELECT r.*, d.name as doctor_name 
                 FROM medical_records r 
                 LEFT JOIN users d ON r.doctor_id = d.id 
                 WHERE r.patient_id = ? 
                 ORDER BY r.created_at DESC`,
                [patientId],
                (err, rows) => {
                    if (err) return reject(new AppError('Database error', 500));
                    resolve(rows);
                }
            );
        });
    }
}
