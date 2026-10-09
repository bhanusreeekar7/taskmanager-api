
export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
}

export type safeUser = Omit<User, "password_hash">;

export interface JwtPayload {
    userId: number;
    email: string;
}