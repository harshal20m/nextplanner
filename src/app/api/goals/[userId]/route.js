import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";

// GET - Fetch user's weekly goals
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { userId } = await params;

        const user = await User.findOne({ id: userId });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            weeklyTextGoal: user.weeklyTextGoal || "",
            weeklyNumericGoal: user.weeklyNumericGoal || 10,
            lastGoalUpdate: user.lastGoalUpdate || "",
        });
    } catch (error) {
        console.error("Error fetching goals:", error);
        return NextResponse.json(
            { error: "Failed to fetch goals" },
            { status: 500 }
        );
    }
}

// PUT - Update user's weekly goals
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { userId } = await params;
        const { weeklyTextGoal, weeklyNumericGoal } = await request.json();

        const user = await User.findOne({ id: userId });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check 24-hour cooldown
        const now = new Date();
        const lastUpdate = user.lastGoalUpdate
            ? new Date(user.lastGoalUpdate)
            : null;
        const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (lastUpdate && now - lastUpdate < cooldownPeriod) {
            const remainingTime = cooldownPeriod - (now - lastUpdate);
            const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));

            return NextResponse.json(
                {
                    error: "Goal update cooldown active",
                    remainingHours,
                    message: `You can update your goal again in ${remainingHours} hours`,
                },
                { status: 429 }
            );
        }

        // Update goals
        const updateData = {
            lastGoalUpdate: now.toISOString(),
        };

        if (weeklyTextGoal !== undefined) {
            updateData.weeklyTextGoal = weeklyTextGoal;
        }

        if (weeklyNumericGoal !== undefined) {
            updateData.weeklyNumericGoal = weeklyNumericGoal;
        }

        await User.findOneAndUpdate({ id: userId }, updateData, { new: true });

        return NextResponse.json({
            success: true,
            message: "Goals updated successfully",
            weeklyTextGoal: updateData.weeklyTextGoal || user.weeklyTextGoal,
            weeklyNumericGoal:
                updateData.weeklyNumericGoal || user.weeklyNumericGoal,
            lastGoalUpdate: updateData.lastGoalUpdate,
        });
    } catch (error) {
        console.error("Error updating goals:", error);
        return NextResponse.json(
            { error: "Failed to update goals" },
            { status: 500 }
        );
    }
}
