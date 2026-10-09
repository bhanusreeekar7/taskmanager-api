import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import taskRoutes from "./routes/tasks.routes.js";
const app = express();
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ message: "health ok" });
})
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);
export default app;
