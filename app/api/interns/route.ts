//api/interns/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import { generateAlphanumeric } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { internID, fullName, photoUrl, startDate, endDate, professorDetails } = body;

    // Generate a random 8-character alphanumeric password
    const password = generateAlphanumeric(8);

    const intern = await Intern.create({
      internID,
      password,
      fullName,
      photoUrl,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
  } catch (error: any) {
    console.error("API error:", error);
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
    const interns = await Intern.find({}).select('-password');
    return NextResponse.json({ success: true, data: interns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
