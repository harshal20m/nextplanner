import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    image: String,
    createdAt: String,
    id: String,
    weeklyTextGoal: { type: String, default: "" },
    weeklyNumericGoal: { type: Number, default: 10 },
    lastGoalUpdate: { type: String, default: "" },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
