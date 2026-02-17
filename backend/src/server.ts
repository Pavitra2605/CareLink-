import dotenv from 'dotenv';
import app from './app';
import { logger, logInfo, logError } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let server: any;
try {
    server = app.listen(PORT, () => {
        logInfo(`Server started successfully`, {
            port: PORT,
            environment: NODE_ENV,
            timestamp: new Date().toISOString()
        });
        
        if (NODE_ENV !== 'production') {
            console.log(`\n🚀 CareLink Backend Running`);
            console.log(`   URL: http://localhost:${PORT}`);
            console.log(`   API Docs: http://localhost:${PORT}/api-docs`);
            console.log(`   Health: http://localhost:${PORT}/health`);
            console.log(`   Metrics: http://localhost:${PORT}/metrics\n`);
        }
    });
} catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    logError('UNHANDLED REJECTION - Shutting down', err, {
        name: err?.name,
        message: err?.message
    });
    
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    logError('UNCAUGHT EXCEPTION - Shutting down', err);
    console.error('Full error details:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logInfo('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logInfo('HTTP server closed');
        process.exit(0);
    });
});

export default server;
