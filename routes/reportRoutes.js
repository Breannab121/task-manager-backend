import express from "express"
import { exportTasksReport, exportUsersReport } from "../controllers/reportControllers.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";


const router = express.Router()

router.get("/export/tasks", protect, adminOnly, exportTasksReport);
router.get("/export/users", protect, adminOnly, exportUsersReport);

export default router