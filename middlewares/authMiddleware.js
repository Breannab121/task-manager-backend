import jwt from "jsonwebtoken"
import User from "../models/User.js"

// middleware to protect routes
export const protect = async (req, res, next) => {
    try { 
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            // Extract token from "Bearer <token>"
            token = token.split(" ")[1];
            // Verify and decode the token using your secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
              // Attach the user (minus password) to the request object
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "Not Authorizaws, no token"});
        }
    } catch (error) { 
        res.status(401).json({ message: "Token failed", error: error.message})
    }
};

//middleware for admin only access
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(403).json({ message: "Access denied, admin only"} )
    }
};

