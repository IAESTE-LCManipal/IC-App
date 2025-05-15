// app/api/interns/by-sro-slot/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { sroSlot } = body;

    if (!sroSlot) {
      return NextResponse.json({
        success: false,
        error: "SRO slot is required"
      }, { status: 400 });
    }

    // Simply find all interns that have this SRO slot
    const interns = await Intern.find({ sroSlot }).select('-password');

    return NextResponse.json({
      success: true,
      data: interns
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}
