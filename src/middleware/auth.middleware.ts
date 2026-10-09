import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";
import { JwtPayload } from "../types/users.types.js";
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Authentication token missing or wrong", 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError("Authentication token missing", 401);
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    }
    catch (error) {
        throw new AppError("Invalid or expired token", 401);

    }
}