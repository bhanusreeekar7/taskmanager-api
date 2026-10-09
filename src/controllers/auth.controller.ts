import { Request, Response, NextFunction } from "express";
import { authService, AuthService } from "../services/auth.service.js";
import { success } from "zod";
export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({
                success: true,
                message: "Login successfull",
                data: result,
            });

        }
        catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
