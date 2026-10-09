import { pool } from "../config/db.js";
import { Task } from "../types/tasks.types.js";
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from "../schemas/tasks.schemas.js";

export class TasksRepository {
    // 1. CREATE A TASK FOR A USER
    async create(userId: number, data: CreateTaskInput): Promise<Task> {
        const query = `
            INSERT INTO tasks (title, description, status, priority, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pool.query<Task>(query, [
            data.title,
            data.description || null,
            data.status,
            data.priority,
            userId,
        ]);

        const task = result.rows[0];
        if (!task) {
            throw new Error("Failed to create task");
        }
        return task;
    }

    // 2. GET ALL TASKS FOR A USER (with optional filters)
    async findAll(userId: number, filters?: TaskQueryParams): Promise<Task[]> {
        let query = `SELECT * FROM tasks WHERE user_id = $1`;
        const params: (string | number)[] = [userId];

        // Dynamic SQL filtering without SQL injection:
        if (filters?.status) {
            params.push(filters.status);
            query += ` AND status = $${params.length}`;
        }

        if (filters?.priority) {
            params.push(filters.priority);
            query += ` AND priority = $${params.length}`;
        }

        if (filters?.search) {
            params.push(`%${filters.search}%`);
            query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
        }

        query += ` ORDER BY created_at DESC`;

        const result = await pool.query<Task>(query, params);
        return result.rows;
    }

    // 3. GET A SINGLE TASK BY ID (ensuring it belongs to this user)
    async findById(id: number, userId: number): Promise<Task | null> {
        const query = `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`;
        const result = await pool.query<Task>(query, [id, userId]);
        return result.rows[0] || null;
    }

    // 4. UPDATE A TASK
    async update(id: number, userId: number, data: UpdateTaskInput): Promise<Task | null> {
        const fields: string[] = [];
        const params: (string | number)[] = [];

        // Build dynamic SET clause based on what fields the client sent:
        if (data.title !== undefined) {
            params.push(data.title);
            fields.push(`title = $${params.length}`);
        }
        if (data.description !== undefined) {
            params.push(data.description);
            fields.push(`description = $${params.length}`);
        }
        if (data.status !== undefined) {
            params.push(data.status);
            fields.push(`status = $${params.length}`);
        }
        if (data.priority !== undefined) {
            params.push(data.priority);
            fields.push(`priority = $${params.length}`);
        }

        // Always update updated_at timestamp
        fields.push(`updated_at = NOW()`);

        // Add id and userId to params
        params.push(id);
        const idIndex = params.length;

        params.push(userId);
        const userIndex = params.length;

        const query = `
            UPDATE tasks
            SET ${fields.join(", ")}
            WHERE id = $${idIndex} AND user_id = $${userIndex}
            RETURNING *
        `;

        const result = await pool.query<Task>(query, params);
        return result.rows[0] || null;
    }

    // 5. DELETE A TASK
    async delete(id: number, userId: number): Promise<boolean> {
        const query = `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`;
        const result = await pool.query(query, [id, userId]);
        // If 1 row was returned, deletion succeeded
        return (result.rowCount ?? 0) > 0;
    }
}

export const tasksRepository = new TasksRepository();
