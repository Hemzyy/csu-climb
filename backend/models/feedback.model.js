import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        feedbackText: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["bug", "idea", "generalMessage"],
        },
    },
    { timestamps: true }
);

// Create a model
const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;