import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Attendance from "@/app/api/models/attendance";
import { sendToFinance } from "@/lib/sendFinanceEmail";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { internId, fileUrl, slotId } = body;

    const newAttendance = await Attendance.create({
      internId,
      fileUrl,
      slotId,
    });

    // 🔥 wrap email separately
    try {
      await sendToFinance({
        fileUrl,
        internId,
      });
    } catch (emailError) {
      console.error("❌ Email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      attendance: newAttendance,
    });

  } catch (error: any) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}