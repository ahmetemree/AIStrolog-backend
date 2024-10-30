import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    birthTime: {
        type: Date,
        required: true
    },
    subscription: {
        type: String,
        default: "free",
        required: true
    },
    subscriptionEndDate: {
        type: Date,
        required: true
    },
    canWeeklySpin: {
        type: Boolean,
        required: true,
    },
})

export default mongoose.model("User", userSchema);