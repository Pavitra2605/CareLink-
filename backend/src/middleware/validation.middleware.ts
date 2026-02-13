import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error.middleware';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const messages = error.issues.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
            next(new AppError(`Validation Error: ${messages.join(', ')}`, 400));
        } else {
            next(new AppError('Invalid Input', 400));
        }
    }
};
