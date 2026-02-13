import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, AppError } from './middleware/error.middleware';
import './config/database'; // Initialize DB connection

const app: Application = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/users/users.routes';
import triageRouter from './modules/triage/triage.routes';
import consultationRouter from './modules/consultations/consultation.routes';
import recordRouter from './modules/records/records.routes';
import emergencyRouter from './modules/emergency/emergency.routes';

// Routes
app.use('/emergency', emergencyRouter);
app.use('/records', recordRouter);
app.use('/consultations', consultationRouter);
app.use('/triage', triageRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

// Base route for testing
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
