import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTasksAdmin,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin-only route to fetch all tasks
router.get("/admin", authMiddleware, roleMiddleware("admin"), getAllTasksAdmin);

// Standard CRUD routes
router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;