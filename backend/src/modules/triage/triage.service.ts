import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';

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

            const id = uuidv4();

            db.run(
                'INSERT INTO triage_logs (id, user_id, symptoms, severity, recommended_action) VALUES (?, ?, ?, ?, ?)',
                [id, userId, symptoms, severity, recommended_action],
                function (err) {
                    if (err) return reject(new AppError('Error creating triage log', 500));

                    resolve({
                        id,
                        user_id: userId,
                        symptoms,
                        severity,
                        recommended_action,
                        created_at: new Date()
                    });
                }
            );
        });
    }

    static async getMyTriageLogs(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM triage_logs WHERE user_id = ? ORDER BY created_at DESC',
                [userId],
                (err, rows) => {
                    if (err) return reject(new AppError('Database error', 500));
                    resolve(rows);
                }
            );
        });
    }
}
