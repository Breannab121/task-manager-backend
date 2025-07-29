import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/connection.js";
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = 3000
const uri = process.env.MONGO_URI;

// Middleware for CORS
app.use(cors({ origin: process.env.CLIENT_URL || "*", //This sets which frontend is allowed to talk to your backend.
                methods: ["GET" , "POST", "PUT", "DELETE"], //This restricts the types of HTTP requests allowed from the frontend to these four common ones.
                allowedHeaders: ["Content-Type", "Authorization"], //This tells the browser it’s okay to send these headers in a request.
    })
);


// Routes
//app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoutes)
//app.use("/api/task", taskRoutes);
//app.use("/api/reports", reportRoutes);

// Connect to MongoDB and handle the promise
mongoose.connect(uri)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Connection error', err));

//connection Database (connection) start server
db.once("open", () => {
app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});