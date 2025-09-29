import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Planner from '../../../../lib/models/Planner';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { userId } = params;
    const planner = await Planner.findOne({ userId });
    
    if (!planner) {
      return NextResponse.json({ message: "No planner found" }, { status: 404 });
    }
    
    return NextResponse.json(planner.planner);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching planner", error }, { status: 500 });
  }
}
