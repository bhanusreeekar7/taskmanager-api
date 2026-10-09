import { Router } from "express";
import { tasksController } from "../controllers/tasks.contoller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/tasks.schemas.js";

const router = Router();

router.use(authenticate);
router.get("/", (req, res, next) => tasksController.getAll(req, res, next));
router.post("/", validate(createTaskSchema), (req, res, next) => tasksController.create(req, res, next));
router.get("/:id", (req, res, next) => tasksController.getById(req, res, next));
router.patch("/:id", validate(updateTaskSchema), (req, res, next) => tasksController.update(req, res, next));
router.delete("/:id", (req, res, next) => tasksController.delete(req, res, next));

export default router;
