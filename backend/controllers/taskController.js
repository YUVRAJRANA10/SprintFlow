// Handles task CRUD logic
import Task from "../models/Task.js";

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      // Only admin can assign to others
      assignedTo: req.user.role === "admin" ? assignedTo : req.user.id,
      createdBy: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get tasks (admin gets all, user gets own)
export const getTasks = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { createdBy: req.user.id };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only admin or owner can update
    if (req.user.role !== "admin" && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, status, priority, assignedTo } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;

    // Only admin can reassign
    if (req.user.role === "admin" && assignedTo) {
      task.assignedTo = assignedTo;
    }

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only admin or owner can delete
    if (req.user.role !== "admin" && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await task.deleteOne();
    return res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin-only: fetch all tasks
export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};