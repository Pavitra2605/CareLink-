import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../middleware/error.middleware';

export class UserService {

    static async createPatientProfile(userId: string, profileData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const { date_of_birth, gender, address, medical_history } = profileData;

            // Check if profile already exists
            db.get('SELECT id FROM patient_profiles WHERE user_id = ?', [userId], (err, row) => {
                if (err) return reject(new AppError('Database error', 500));
                if (row) return reject(new AppError('Profile already exists', 400));

                const id = uuidv4();

                db.run(
                    'INSERT INTO patient_profiles (id, user_id, date_of_birth, gender, address, medical_history) VALUES (?, ?, ?, ?, ?, ?)',
                    [id, userId, date_of_birth, gender, address, medical_history],
                    function (err) {
                        if (err) return reject(new AppError('Error creating profile', 500));
                        resolve({ id, user_id: userId, ...profileData });
                    }
                );
            });
        });
    }

    static async getPatientProfile(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT u.name, u.email, u.phone, p.* 
                 FROM users u 
                 LEFT JOIN patient_profiles p ON u.id = p.user_id 
                 WHERE u.id = ?`,
                [userId],
                (err, row) => {
                    if (err) return reject(new AppError('Database error', 500));
                    if (!row) return reject(new AppError('User not found', 404));
                    resolve(row);
                }
            );
        });
    }
}
