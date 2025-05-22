//api/admins/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Admin from '@/app/api/models/admin';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, firstName, lastName, password } = body; // Accept password from request

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json({
        success: false,
        error: "All fields (email, firstName, lastName, password) are required."
      }, { status: 400 });
    }

    const admin = await Admin.create({
      email,
      firstName,
      lastName,
      password, // Will be hashed by pre-save hook
      role: 'admin',
    });

    const adminWithoutPassword = {
      ...admin.toObject(),
      password: undefined
    };

    return NextResponse.json({
      success: true,
      data: adminWithoutPassword
    }, { status: 201 });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('API error:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const admins = await Admin.find({}).select('-password');
    return NextResponse.json({ success: true, data: admins });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
