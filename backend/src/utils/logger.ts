import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Define custom log levels
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue'
    }
};

// JSON logging format for structured logs
const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Simple format for console in development
const simpleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}`
    )
);

// Create transports
const transports: winston.transport[] = [
    // Errors log file
    new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format: jsonFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }),
    // All logs file
    new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        format: jsonFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 10
    })
];

// Add console transport only in development
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: simpleFormat
        }) as any
    );
}

// Create logger instance
export const logger = winston.createLogger({
    levels: customLevels.levels,
    transports
});

// Add colors for console output
winston.addColors(customLevels.colors);

// Export convenience methods
export const logError = (message: string, error?: Error, meta?: any) => {
    logger.error(message, {
        stack: error?.stack,
        ...meta
    });
};

export const logWarn = (message: string, meta?: any) => {
    logger.warn(message, meta);
};

export const logInfo = (message: string, meta?: any) => {
    logger.info(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
    logger.debug(message, meta);
};

export default logger;
