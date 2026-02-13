import { z } from 'zod';

// Phone validation: supports formats like +1234567890, (123) 456-7890, 123-456-7890, etc.
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

// Password validation: at least 6 characters, with at least one number or special char
const passwordRegex = /^(?=.*[0-9a-zA-Z])/;

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
        email: z.string().email('Invalid email format'),
        password: z.string()
            .min(6, 'Password must be at least 6 characters')
            .max(128, 'Password must be at most 128 characters')
            .regex(passwordRegex, 'Password must contain at least one letter or number'),
        role: z.enum(['PATIENT', 'DOCTOR', 'PHARMACIST', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN', 'CHW']),
        phone: z.string()
            .regex(phoneRegex, 'Invalid phone format. Use formats like: +1234567890, (123) 456-7890, 123-456-7890')
            .min(10, 'Phone must be at least 10 digits')
            .max(20, 'Phone must be at most 20 characters'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required').max(128, 'Invalid password'),
    }),
});
