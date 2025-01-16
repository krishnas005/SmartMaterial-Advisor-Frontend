// app/api/auth/login/route.js
import dbConnect from '../../../../../utils/db';
import User from '../../../../../models/User';
import bcrypt from 'bcrypt';
import { signToken } from '../../../../../utils/jwt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'All fields are mandatory' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 }
      );
    }

    const token = signToken({
      id: user._id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
    });

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    console.error('Frontend Signup Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}