import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export function validate(schema: ZodType) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) { return next(result.error); }
        req.body = result.data;
        next();
    };

}