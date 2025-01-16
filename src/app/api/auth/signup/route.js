// app/api/auth/signup/route.js
import dbConnect from '../../../../../utils/db';
import User from '../../../../../models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password, employeeId } = await request.json();

    if (!name || !email || !password || !employeeId) {
      return NextResponse.json(
        { message: 'All fields are mandatory' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    const existingID = await User.findOne({ employeeId });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use! Please login.' },
        { status: 400 }
      );
    }
    if (existingID) {
      return NextResponse.json(
        { message: 'Ecmployee ID already in use! Please login.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      employeeId,
    });

    await user.save();
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }

}

