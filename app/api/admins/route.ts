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
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: error.status || 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const admins = await Admin.find({}).select('-password');
    return NextResponse.json({ success: true, data: admins });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
