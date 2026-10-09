import { tasksRepository } from "../repositories/task.repository.js";
import { CreateTaskInput, UpdateTaskInput, TaskQueryParams } from "../schemas/tasks.schemas.js";
import { Task } from "../types/tasks.types.js";
import { AppError } from "../utils/errors.js";

export class TasksService {
    async createTask(userId: number, input: CreateTaskInput): Promise<Task> {
        return await tasksRepository.create(userId, input);
    }
    async getTasks(userId: number, filters?: TaskQueryParams): Promise<Task[]> {
        return await tasksRepository.findAll(userId, filters);
    }

    async getTaskById(id: number, userId: number): Promise<Task> {
        const task = await tasksRepository.findById(id, userId);
        if (!task) {
            throw new AppError("Task not found", 404);
        }
        return task;
    }

    async updateTask(id: number, userId: number, input: UpdateTaskInput): Promise<Task> {
        const updatedTask = await tasksRepository.update(id, userId, input);
        if (!updatedTask) {
            throw new AppError("Task not found", 404);
        }
        return updatedTask;
    }
    async deleteTask(id: number, userId: number): Promise<void> {
        const deleted = await tasksRepository.delete(id, userId);
        if (!deleted) {
            throw new AppError("Task not found", 404);
        }
    }
}



export const tasksService = new TasksService();
