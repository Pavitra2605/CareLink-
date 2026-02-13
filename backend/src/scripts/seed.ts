import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// Wait for database to be ready
const waitForDb = () => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, 500); // Wait 500ms for schema to be initialized
    });
};

const seed = async () => {
    console.log('Seeding database...');

    // Wait for schema initialization
    await waitForDb();

    // Helper function to create or get user
    const ensureUser = async (name: string, email: string, role: string, phone: string) => {
        return new Promise<string>((resolve, reject) => {
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

    // Helper to create profile if needed
    const ensureProfile = async (userId: string) => {
        return new Promise<void>((resolve, reject) => {
            db.get('SELECT id FROM patient_profiles WHERE user_id = ?', [userId], (err, row: any) => {
                if (err) return reject(err);

                if (!row) {
                    const profileId = uuidv4();
                    db.run(
                        'INSERT INTO patient_profiles (id, user_id, date_of_birth, gender, address, medical_history) VALUES (?, ?, ?, ?, ?, ?)',
                        [profileId, userId, '1990-01-01', 'Male', '123 Main St', 'None'],
                        (err) => {
                            if (err) reject(err);
                            else {
                                console.log('Patient Profile created');
                                resolve();
                            }
                        }
                    );
                } else {
                    console.log('Patient Profile already exists');
                    resolve();
                }
            });
        });
    };

    try {
        const patientId = await ensureUser('John Doe', 'john@example.com', 'PATIENT', '1234567890');
        const doctorId = await ensureUser('Dr. Smith', 'doctor@example.com', 'DOCTOR', '0987654321');
        
        await ensureProfile(patientId);
        
        console.log('✅ Database seeding completed successfully');
        db.close();
    } catch (error) {
        console.error('Seeding failed:', error);
        db.close();
    }
};

seed();
