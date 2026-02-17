import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import { errorHandler, AppError } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import metricsMiddleware, { getMetrics } from './middleware/metrics.middleware';
import { logger, logInfo } from './utils/logger';
import swaggerSpec from './config/swagger';
import './config/database'; // Initialize DB connection

import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/users/users.routes';
import triageRouter from './modules/triage/triage.routes';
import consultationRouter from './modules/consultations/consultation.routes';
import recordRouter from './modules/records/records.routes';
import emergencyRouter from './modules/emergency/emergency.routes';
import timelineRouter from './modules/timeline/timeline.routes';
import analyticsRouter from './modules/analytics/analytics.routes';
import db from './config/database';

const app: Application = express();

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));

// CORS Configuration - Support multiple origins
const corsOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];

app.use(cors({
    origin: corsOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Disable x-powered-by header
app.disable('x-powered-by');

// Request Logging with Morgan integrated into Winston
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Body Parser Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Metrics Tracking Middleware
app.use(metricsMiddleware);

// Rate Limiting
app.use(apiLimiter);

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health Check
 *     description: Check if server and database are operational
 *     responses:
 *       200:
 *         description: Server and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 database:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
app.get('/health', (req: Request, res: Response) => {
    db.get('SELECT 1', (err) => {
        if (err) {
            logInfo('Health check failed', { error: err.message });
            res.status(500).json({ 
                status: 'ERROR',
                database: 'disconnected',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(200).json({
                status: 'OK',
                database: 'connected',
                timestamp: new Date().toISOString()
            });
        }
    });
});

/**
 * @swagger
 * /metrics:
 *   get:
 *     tags:
 *       - System
 *     summary: System Metrics
 *     description: Get performance and usage metrics
 *     responses:
 *       200:
 *         description: System metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                 memoryUsage:
 *                   type: object
 *                 requestMetrics:
 *                   type: object
 *                 statusCodes:
 *                   type: object
 */
app.get('/metrics', (req: Request, res: Response) => {
    const metricsData = getMetrics();
    res.status(200).json({
        success: true,
        data: metricsData
    });
});

// Swagger API Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: true
    },
    customCss: '.topbar { display: none }'
}));

// Routes with /api prefix
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/triage', triageRouter);
app.use('/api/consultations', consultationRouter);
app.use('/api/records', recordRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/patients', timelineRouter);
app.use('/api/admin/metrics', analyticsRouter);

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - System
 *     summary: API Status
 *     description: Check if API is running
 *     responses:
 *       200:
 *         description: API is operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 features:
 *                   type: array
 */
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'CareLink Healthcare API',
        version: '3.0.0',
        status: 'operational',
        features: [
            'Layer 1: Production Security Hardening',
            'Layer 2: Intelligent Workflow & Observability',
            'Layer 3: Production Observability & Monitoring'
        ],
        documentation: '/api-docs',
        health: '/health',
        metrics: '/metrics'
    });
});

// 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
