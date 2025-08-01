import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
};


// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = 
        req.body;
        //check if user already exist
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exist"})
        }

        //Determine user role: admin if correct token is provided, otherwise 
        let role = "member";
        if (
            adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN
        ) {
            role = "admin"
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // Return user data with JWT
        res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid email or password"})
        }

        //Return user data with JWT (token)
        res.json({
            token: generateToken(user._id),
            _id: user.id,
            name: user.name,
            email: user.email, 
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        })
    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
};
    
// @desc Get user profile
// @route POST /api/auth/profile
// @access Private (Requires JWT)
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user);
    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
};

// @desc Update user profile
// @route POST /api/auth/profile
// @access Private (Requires JWT)
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.ststus(403).json({ messsage: "User not found"})
        }

        user.name = req.body.name || user.name;
        user.email = req.bpdy.emial || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        })
    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
};




