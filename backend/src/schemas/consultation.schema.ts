import { z } from 'zod';

export const requestConsultationSchema = z.object({
    body: z.object({
        notes: z.string().optional(),
    }),
});

export const updateConsultationStatusSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED']),
    }),
    params: z.object({
        id: z.string().uuid('Invalid Consultation ID'),
    }),
});
