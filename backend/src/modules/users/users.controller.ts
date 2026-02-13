import { Response, NextFunction } from 'express';
import { UserService } from './users.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export class UserController {

    static async createProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await UserService.createPatientProfile(req.user.id, req.body);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await UserService.getPatientProfile(req.user.id);
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
