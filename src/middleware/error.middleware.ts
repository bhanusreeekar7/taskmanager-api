import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ success: false, error: err.message });
        return;
    }
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            error: "Validation failed",
            details: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }

    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "23505") {
        res.status(409).json({
            success: false,
            error: "Resource already exists (e.g. email already registered)",
        });
        return;
    }
    console.error("Unhandled Error:", err);
    res.status(500).json({
        success: false,
        error: "Internal server error",
    });
};
