import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export class AuthService {

    // Register User
    static async register(userData: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const { name, email, password, role, phone } = userData;

            if (!name || !email || !password || !role) {
                return reject(new AppError('Please provide all required fields', 400));
            }

            // Check if user exists
            db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
                if (err) return reject(new AppError('Database error', 500));
                if (row) return reject(new AppError('Email already in use', 400));

                const hashedPassword = await bcrypt.hash(password, 12);
                const id = uuidv4();

                db.run(
                    'INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
                    [id, name, email, hashedPassword, role, phone],
                    function (err) {
                        if (err) return reject(new AppError('Error creating user', 500));

                        const token = jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
                            expiresIn: '1h'
                        });

                        resolve({
                            token,
                            user: { id, name, email, role, phone }
                        });
                    }
                );
            });
        });
    }

    // Login User
    static async login(loginData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const { email, password } = loginData;

            if (!email || !password) {
                return reject(new AppError('Please provide email and password', 400));
            }

            db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user: any) => {
                if (err) return reject(new AppError('Database error', 500));
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return reject(new AppError('Incorrect email or password', 401));
                }

                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
                    expiresIn: '1h'
                });

                resolve({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        phone: user.phone
                    }
                });
            });
        });
    }

    // Get Current User
    static async getMe(userId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?', [userId], (err, user) => {
                if (err) return reject(new AppError('Database error', 500));
                if (!user) return reject(new AppError('User not found', 404));
                resolve(user);
            });
        });
    }
}
