import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
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
        type: String,
        required: true
    },
    subscription: {
        type: String,
        default: "free",
        required: true
    },
    subscriptionEndDate: {
        type: String,
        required: false
    },
    canWeeklySpin: {
        type: Boolean,
        required: true,
    },
    isFirstTime: {
        type: Boolean,
        required: true,
    },
    zodiacSign: {
        type: String,
        required: true,
    }
})

export default mongoose.model("User", userSchema);