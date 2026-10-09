import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { UsersRepository, usersRepository } from "../repositories/users.repository.js";
import { safeUser } from "../types/users.types.js";
import { AppError } from "../utils/errors.js";
import { env } from "../config/env.js";
import { LoginInput, RegisterInput } from "../schemas/users.schemas.js";

export class AuthService {
    async register(input: RegisterInput): Promise<{ user: safeUser; token: string }> {
        const existingUser = await usersRepository.findByEmail(input.email);
        if (existingUser) {
            throw new AppError("Email already exists", 409);
        }
        const password_hash = await bcrypt.hash(input.password, 10);
        const newUser = await usersRepository.create(input.name, input.email, password_hash);
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const safeUserData: safeUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            created_at: newUser.created_at,
        };
        return { user: safeUserData, token };
    }
    async login(input: LoginInput): Promise<{ user: safeUser; token: string }> {
        const user = await usersRepository.findByEmail(input.email);
        if (!user) {
            throw new AppError("invalid email or password", 401);
        }
        const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);
        if (!isPasswordValid) {
            throw new AppError("invalid email or password", 401);
        }
        const token = jwt.sign({ userId: user.id, email: user.email },
            env.JWT_SECRET,
            { expiresIn: "7d" });
        const safeUserData: safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
        };
        return { user: safeUserData, token }
    }
}
export const authService = new AuthService();
