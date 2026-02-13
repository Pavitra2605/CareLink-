import { z } from 'zod';

export const triggerEmergencySchema = z.object({
    body: z.object({
        description: z.string().optional(),
        location: z.string().optional(),
    }),
});
