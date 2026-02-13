import { z } from 'zod';

export const createPatientProfileSchema = z.object({
    body: z.object({
        date_of_birth: z.string()
            .refine((date) => {
                const d = new Date(date);
                const age = new Date().getFullYear() - d.getFullYear();
                return age >= 0 && age <= 150;
            }, 'Invalid date of birth'),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
        address: z.string()
            .min(5, 'Address must be at least 5 characters')
            .max(255, 'Address must be at most 255 characters'),
        medical_history: z.string()
            .max(1000, 'Medical history must be at most 1000 characters')
            .optional(),
    }),
});
