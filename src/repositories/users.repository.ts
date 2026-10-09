import { pool } from "../config/db.js";
import { User, safeUser } from "../types/users.types.js";

export class UsersRepository {
    async findByEmail(email: string): Promise<User | null> {
        const query = `select * from users where email=$1`;
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    }
    async findById(id: number): Promise<safeUser | null> {
        const result = await pool.query<safeUser>(`select id,name,email,created_at from users where id=$1`, [id]);
        return result.rows[0] || null;
    }
    async create(name: string, email: string, password_hash: string): Promise<User> {
        const result = await pool.query<User>(
            `insert into users(name,email,password_hash) values($1,$2,$3) returning *`,
            [name, email, password_hash]
        );
        const user = result.rows[0];
        if (!user) {
            throw new Error("Failed to create user in database");
        }
        return user;
    }
}


export const usersRepository = new UsersRepository();