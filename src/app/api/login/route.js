import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    const user = await User.findOne({ email, password });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ message: "Login failed", error: err.message }, { status: 500 });
  }
}
