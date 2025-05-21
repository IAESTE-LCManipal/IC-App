import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import SROChecklist from '@/app/api/models/sroChecklist';

// POST: /api/lc/section-stats
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { sroSlot } = body;

    if (!sroSlot) {
      return NextResponse.json({
        success: false,
        error: 'SRO slot is required',
      }, { status: 400 });
    }

    // Get all interns in this SRO slot
    const interns = await Intern.find({ sroSlot });
    const internIDs = interns.map((i: any) => i.internID);

    // Get all checklists for these interns
    const checklists = await SROChecklist.find({ internID: { $in: internIDs } });

    // Count completed SRO checklists (all fields true)
    const completedSRO = checklists.filter((c: any) => {
      if (!c.checklist) return false;
      return Object.values(c.checklist).every(Boolean);
    }).length;

    // Count interns with any checklist (at least one field true)
    const completedAny = checklists.filter((c: any) => {
      if (!c.checklist) return false;
      return Object.values(c.checklist).some(Boolean);
    }).length;

    // Count interns with 0 checklist items completed (all fields false or checklist missing)
    const zeroCompleted = checklists.filter((c: any) => {
      if (!c.checklist) return true;
      return Object.values(c.checklist).every(v => !v);
    }).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalInterns: interns.length,
        completedSRO,
        completedAny,
        zeroCompleted,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
