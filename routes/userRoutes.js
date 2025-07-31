import express from "express"
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { getUsers, getUserById } from "../controllers/userControllers.js";

const router = express.Router();


//User Management Routes
router.get("/", protect, adminOnly, getUsers); //Get all users (admin only)
router.get("/:id", protect, getUserById); //Get a specific user



export default router