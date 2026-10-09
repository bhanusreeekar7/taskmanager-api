import { Request, Response, NextFunction } from "express";
import { tasksService } from "../services/tasks.services.js";

export class TasksController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const task = await tasksService.createTask(userId, req.body);
            res.status(201).json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const tasks = await tasksService.getTasks(userId, req.query);
            res.status(200).json({ success: true, count: tasks.length, data: tasks });
        } catch (error) {
            next(error);
        }
    }
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const taskId = Number(req.params.id);
            const task = await tasksService.getTaskById(taskId, userId);
            res.status(200).json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    }
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const taskId = Number(req.params.id);
            const task = await tasksService.updateTask(taskId, userId, req.body);
            res.status(200).json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const taskId = Number(req.params.id);
            await tasksService.deleteTask(taskId, userId);
            res.status(200).json({ success: true, message: "Task deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export const tasksController = new TasksController();
