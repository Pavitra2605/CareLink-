import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name is required'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['PATIENT', 'DOCTOR', 'PHARMACIST', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN', 'CHW']),
        phone: z.string().min(10, 'Phone must be at least 10 characters'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
});
