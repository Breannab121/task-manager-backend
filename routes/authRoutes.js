import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/authControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

//Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);


//is only responsible for uploading the file and returning its URL
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "no file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({ imageUrl });
});


//Update the users profile
router.put("/users/:id/profile-image", async (req, res) => {
    const { profileImageUrl } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profileImageUrl },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile image updated", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;