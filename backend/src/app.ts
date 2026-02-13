import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, AppError } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import './config/database'; // Initialize DB connection

import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/users/users.routes';
import triageRouter from './modules/triage/triage.routes';
import consultationRouter from './modules/consultations/consultation.routes';
import recordRouter from './modules/records/records.routes';
import emergencyRouter from './modules/emergency/emergency.routes';
import db from './config/database';

const app: Application = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(apiLimiter); // Apply rate limiting to all requests
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
    db.get('SELECT 1', (err) => {
        if (err) {
            res.status(500).json({ status: 'ERROR', database: 'disconnected', timestamp: new Date().toISOString() });
        } else {
            res.status(200).json({ status: 'OK', database: 'connected', timestamp: new Date().toISOString() });
        }
    });
});

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/triage', triageRouter);
app.use('/consultations', consultationRouter);
app.use('/records', recordRouter);
app.use('/emergency', emergencyRouter);

// Base route
app.get('/', (req, res) => {
    res.send('CareLink API is running...');
});

// 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
