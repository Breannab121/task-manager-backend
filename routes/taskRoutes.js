import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { createTask, deleteTask, getDashboardData, getTask, getTaskById, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from "../controllers/taskControllers.js";


const router = express.Router()

//Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTask); //Get all task (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by Id
    
router.post("/", protect, adminOnly, createTask); // Create a task (admin only)

router.put("/:id", protect, updateTask); // Update task details

router.delete("/:id", protect, adminOnly, deleteTask); //Delete a task (Admin Only)

router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist) //Update task checklist

export default router