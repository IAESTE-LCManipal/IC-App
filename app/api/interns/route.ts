//api/interns/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import { generateAlphanumeric } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { internID, fullName, photoUrl, startDate, endDate, sroSlot, professorDetails } = body;

    // Generate a random 8-character alphanumeric password
    const password = generateAlphanumeric(8);

    const intern = await Intern.create({
        internID,
        password,
        fullName,
        photoUrl,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sroSlot,
        professorDetails
    });

    // Return the intern without the hashed password
    const internWithoutPassword = {
      ...intern.toObject(),
      password: undefined
    };

    return NextResponse.json({
      success: true,
      data: internWithoutPassword,
      plainPassword: password // Only return this during creation for admin to share with intern
    }, { status: 201 });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error("API error:", err);
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
    const interns = await Intern.find({}).select('-password');
    return NextResponse.json({ success: true, data: interns });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
