import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2, "name must be atleast 2 characters"),
    email: z.string().trim().toLowerCase().email("invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 characters long")
});

export const loginSchema = z.object({
    email: z.string().trim().email("invalid email address"),
    password: z.string().min(1, "password is requried"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;