import { z } from 'zod';

export const createTriageSchema = z.object({
    body: z.object({
        symptoms: z.string().min(3, 'Symptoms description is required'),
        severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    }),
});
