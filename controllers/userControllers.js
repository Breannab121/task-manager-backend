import Task from "../models/Task.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

//@desc Get all users (admin only)
//@route Get /api/users/
//@access Private (admin)
export const getUsers = async (req, res) => {
     try {
        const users = await User.find({ role: "member" }).select("-password");

        // Add task counts to each user
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                console.log("🔍 Mapping user:", user.name || user.email);
                const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
                const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
                const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                };
            })
        );

        res.status(200).json(usersWithTaskCounts);

    } catch (error) {
        res.status(500).json ({ message: "server error", error: error.message })
    }
};


//@desc Get user by ID
//@route Get /api/users/:id
//@access Private
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json ({ message: "server error", error: error.message })
    }
};