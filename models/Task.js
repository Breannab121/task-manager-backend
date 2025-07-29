import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        completed: {
    type: Boolean,
            default: false,
        }
    }
);

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: Boolean,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"], dafault: "Medium"
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"], default: "Pending"
        },
        dueDate: {
            type: Date,
            required: true
        },
        assignedTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        attachments: [{
            type: String
        }],
        todoChecklist:[todoSchema],
        progress: {type: Number, default: 0}

        },
        { timestamps: true} 
);

export default mongoose.model("Task", taskSchema);
