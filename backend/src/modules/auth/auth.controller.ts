import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const clientIp = AuthController.getClientIp(req);
            const result = await AuthService.register(req.body, clientIp);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const clientIp = AuthController.getClientIp(req);
            const result = await AuthService.login(req.body, clientIp);
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.getMe(req.user.id);
            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Extract client IP from request.
     * Handles cases where app is behind proxy.
     */
    private static getClientIp(req: Request): string {
        const forwarded = req.headers['x-forwarded-for'];
        if (typeof forwarded === 'string') {
            return forwarded.split(',')[0].trim();
        }
        if (Array.isArray(forwarded)) {
            return forwarded[0].trim();
        }
        return req.socket.remoteAddress || 'UNKNOWN';
    }
}
