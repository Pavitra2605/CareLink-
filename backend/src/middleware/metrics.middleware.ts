import { Request, Response, NextFunction } from 'express';

// Global metrics state
interface Metrics {
    startTime: number;
    totalRequests: number;
    totalErrors: number;
    requestTimes: number[];
    statusCodes: { [key: number]: number };
}

const metrics: Metrics = {
    startTime: Date.now(),
    totalRequests: 0,
    totalErrors: 0,
    requestTimes: [],
    statusCodes: {}
};

/**
 * Middleware to track request metrics
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Wrap res.send to capture response time and status
    const originalSend = res.send;
    res.send = function(data: any) {
        const responseTime = Date.now() - startTime;
        
        metrics.totalRequests++;
        metrics.requestTimes.push(responseTime);
        
        const statusCode = res.statusCode;
        metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;
        
        if (statusCode >= 400) {
            metrics.totalErrors++;
        }
        
        // Keep only last 100 request times for performance
        if (metrics.requestTimes.length > 100) {
            metrics.requestTimes.shift();
        }
        
        return originalSend.call(this, data);
    };
    
    next();
};

/**
 * Get current system metrics
 */
export const getMetrics = () => {
    const uptime = Date.now() - metrics.startTime;
    const memoryUsage = process.memoryUsage();
    const avgResponseTime = metrics.requestTimes.length > 0
        ? metrics.requestTimes.reduce((a, b) => a + b, 0) / metrics.requestTimes.length
        : 0;
    
    return {
        uptime: Math.floor(uptime / 1000), // seconds
        memoryUsage: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB', // Resident Set Size
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
            external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
        },
        requestMetrics: {
            totalRequests: metrics.totalRequests,
            totalErrors: metrics.totalErrors,
            errorRate: metrics.totalRequests > 0 
                ? ((metrics.totalErrors / metrics.totalRequests) * 100).toFixed(2) + '%'
                : '0%',
            avgResponseTime: Math.round(avgResponseTime) + ' ms'
        },
        statusCodes: metrics.statusCodes,
        timestamp: new Date().toISOString()
    };
};

/**
 * Reset metrics (useful for testing)
 */
export const resetMetrics = () => {
    metrics.totalRequests = 0;
    metrics.totalErrors = 0;
    metrics.requestTimes = [];
    metrics.statusCodes = {};
};

export default metricsMiddleware;
