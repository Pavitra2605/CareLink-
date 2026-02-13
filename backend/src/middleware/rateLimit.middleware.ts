import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        status: 'fail',
        message: 'Too many login attempts from this IP, please try again after a minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 requests per minute for general API
    message: {
        status: 'fail',
        message: 'Too many requests, please try again later'
    }
});

export const criticalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10, // Strict limit for emergency/triage
    message: {
        status: 'fail',
        message: 'Too many critical requests, please try again later'
    }
});
