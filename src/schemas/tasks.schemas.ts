import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title cannot be empty").max(100, "Title cannot exceed 100 characters"),
    description: z.string().trim().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),

});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(1, "Title cannot be empty").max(100).optional(),
    description: z.string().trim().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" }

);

export const taskIdParamSchema = z.object({
    id: z.coerce.number().int().positive("Task ID must be a positive integer"),
});

export const taskQuerySchema = z.object({
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    search: z.string().trim().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
export type TaskQueryParams = z.infer<typeof taskQuerySchema>;