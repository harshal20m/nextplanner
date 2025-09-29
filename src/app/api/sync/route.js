import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import Planner from '../../../lib/models/Planner';

export async function POST(request) {
  try {
    await connectDB();
    
    const { user, planner: incomingPlanner } = await request.json();

    // Upsert User
    await User.findOneAndUpdate({ id: user.id }, user, { upsert: true });

    // Fetch existing planner
    let existing = await Planner.findOne({ userId: user.id });

    // Merge planners
    const mergedPlanner = { ...(existing?.planner || {}) };

    for (const date in incomingPlanner) {
      if (!mergedPlanner[date]) {
        // No data for this date — use incoming
        mergedPlanner[date] = incomingPlanner[date];
      } else {
        // Merge tasks for this date
        const existingTasks = mergedPlanner[date].tasks || {};
        const newTasks = incomingPlanner[date].tasks || {};

        mergedPlanner[date].tasks = {
          ...existingTasks,
          ...newTasks,
        };
      }
    }

    // Save merged planner
    await Planner.findOneAndUpdate(
      { userId: user.id },
      { userId: user.id, planner: mergedPlanner },
      { upsert: true }
    );

    return NextResponse.json({ message: "Planner synced with merge." });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ message: "Error syncing planner", error }, { status: 500 });
  }
}
