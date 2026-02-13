import { z } from 'zod';

export const createRecordSchema = z.object({
    body: z.object({
        patient_id: z.string().uuid('Invalid Patient ID'),
        diagnosis: z.string().min(2, 'Diagnosis is required'),
        prescription: z.string().optional(),
        notes: z.string().optional(),
    }),
});
