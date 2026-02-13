import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';

export class EmergencyService {

    static async triggerEmergency(userId: string, emergencyData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const { description, location } = emergencyData;

            const id = uuidv4();
            const status = 'TRIGGERED';

            db.run(
                'INSERT INTO emergency_events (id, patient_id, status, description, location) VALUES (?, ?, ?, ?, ?)',
                [id, userId, status, description, location],
                function (err) {
                    if (err) return reject(new AppError('Error triggering emergency', 500));
                    resolve({
                        id,
                        patient_id: userId,
                        status,
                        description,
                        location,
                        created_at: new Date()
                    });
                }
            );
        });
    }

    static async getMyEmergencyEvents(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM emergency_events WHERE patient_id = ? ORDER BY created_at DESC',
                [userId],
                (err, rows) => {
                    if (err) return reject(new AppError('Database error', 500));
                    resolve(rows);
                }
            );
        });
    }
}
