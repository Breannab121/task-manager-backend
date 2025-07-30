import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Username is required'], // Field must be provided
            trim: true,                             // Removes whitespace
            minlength: 3                           // Minimum length
        },
        email: {
            type: String,
            required: true,
            unique: true // Must be unique in the collection
        },
        password: {
            type: String,
            required: true
        },
        profileImageUrl: {
            type: String,
            default: null
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        }
    },
    { timestamps: true}
);

//create the user model for the users collection
export default mongoose.model("User", userSchema);