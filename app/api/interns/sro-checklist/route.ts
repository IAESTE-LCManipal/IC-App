// app/api/interns/sro-checklist/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'lc') {
      return NextResponse.json({
        success: false,
        error: "Unauthorized"
      }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { internId, checklist } = body;

    if (!internId || !checklist) {
      return NextResponse.json({
        success: false,
        error: "Intern ID and checklist are required"
      }, { status: 400 });
    }

    // Create or update the SRO checklist
    const updatedIntern = await Intern.findByIdAndUpdate(
      internId,
      { $set: { sroChecklist: checklist } },
      { new: true }
    ).select('-password');

    if (!updatedIntern) {
      return NextResponse.json({
        success: false,
        error: "Intern not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedIntern
    });

  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}
