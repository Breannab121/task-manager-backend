import express from "express";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for CORS
app.use(cors({ origin: process.env.CLIENT_URL || "*",
                methods: ["GET" , "POST", "PUT", "DELETE"],
                allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Routes
//app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoutes)
//app.use("/api/task", taskRoutes);
//app.use("/api/reports", reportRoutes);

// Start server
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
