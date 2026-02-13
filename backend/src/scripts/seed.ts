import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const seed = async () => {
    console.log('Seeding database...');

    // Helper function to create or get user
    const ensureUser = async (name: string, email: string, role: string, phone: string) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row: any) => {
                if (err) return reject(err);

                if (row) {
                    console.log(`User ${email} already exists. Using ID: ${row.id}`);
                    return resolve(row.id);
                }

                const id = uuidv4();
                const hashedPassword = await bcrypt.hash('password123', 12);

                db.run(
                    'INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
                    [id, name, email, hashedPassword, role, phone],
                    (err) => {
                        if (err) return reject(err);
                        console.log(`User ${email} created with ID: ${id}`);
                        resolve(id);
                    }
                );
            });
        });
    };

    try {
        const patientId = await ensureUser('John Doe', 'john@example.com', 'PATIENT', '1234567890');
        const doctorId = await ensureUser('Dr. Smith', 'doctor@example.com', 'DOCTOR', '0987654321');

        // Check and create profile
        db.get('SELECT id FROM patient_profiles WHERE user_id = ?', [patientId], (err, row) => {
            if (err) {
                console.error('Error checking profile:', err);
                return;
            }

            if (!row) {
                const profileId = uuidv4();
                db.run(
                    'INSERT INTO patient_profiles (id, user_id, date_of_birth, gender, address, medical_history) VALUES (?, ?, ?, ?, ?, ?)',
                    [profileId, patientId, '1990-01-01', 'Male', '123 Main St', 'None'],
                    (err) => {
                        if (err) console.error('Error creating profile:', err.message);
                        else console.log('Patient Profile created');
                    }
                );
            } else {
                console.log('Patient Profile already exists');
            }
        });

    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

seed();
