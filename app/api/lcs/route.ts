//api/lcs/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/lc';
import { generateAlphanumeric } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, firstName, lastName, sroSlot } = body;

    // Generate a random 8-character alphanumeric password
    const password = generateAlphanumeric(8);

    const lc = await Intern.create({
        email,
        firstName,
        lastName,
        sroSlot,
        password,
    });

    // Return the intern without the hashed password
    const internWithoutPassword = {
      ...lc.toObject(),
      password: undefined
    };

    return NextResponse.json({
      success: true,
      data: internWithoutPassword,
      plainPassword: password // Only return this during creation for admin to share with intern
    }, { status: 201 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: error.status || 400 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const slot = url.searchParams.get("slot");
    let query = {};
    if (slot) {
      query = { sroSlot: slot.padStart(2, "0") };
    }
    const interns = await Intern.find(query).select('-password');
    return NextResponse.json({ success: true, data: interns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
