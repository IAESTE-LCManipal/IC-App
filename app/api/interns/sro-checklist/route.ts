// app/api/interns/sro-checklist/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import SROChecklist from '@/app/api/models/sroChecklist';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== 'lc') {
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

    // Check if intern exists
    const intern = await Intern.findById(internId);
    if (!intern) {
      return NextResponse.json({
        success: false,
        error: "Intern not found"
      }, { status: 404 });
    }

    // Use intern.internID (the string) as the link for the checklist
    const updatedChecklist = await SROChecklist.findOneAndUpdate(
      { internID: intern.internID },
      { checklist, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    // Optionally, you can also update the Intern's sroChecklist field if you want to keep it in sync
    // await Intern.findByIdAndUpdate(
    //   internId,
    //   { $set: { sroChecklist: checklist } },
    //   { new: true }
    // ).select('-password');

    return NextResponse.json({
      success: true,
      data: updatedChecklist
    });

  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error("API error:", err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 400 });
  }
}
