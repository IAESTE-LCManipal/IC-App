import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import SROChecklist from '@/app/api/models/sroChecklist';
import Slot from '@/app/api/models/slot';

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

    // Find the slot's date range
    const slotDoc = await Slot.findOne({ slotNumber: Number(sroSlot) });
    if (!slotDoc) {
      return NextResponse.json({
        success: false,
        error: 'Slot not found',
      }, { status: 404 });
    }

    // Find all interns whose stay overlaps with the slot's date range
    const interns = await Intern.find({
      startDate: { $lte: slotDoc.to },
      endDate: { $gte: slotDoc.from },
    });
    const internIDs = interns.map((i: { internID: string }) => i.internID);

    // Get all checklists for these interns
    const checklists = await SROChecklist.find({ internID: { $in: internIDs } });

    // Count completed SRO checklists (all fields true)
    const completedSRO = checklists.filter((c: { checklist: Record<string, boolean> }) => {
      if (!c.checklist) return false;
      return Object.values(c.checklist).every(Boolean);
    }).length;

    // Count interns with any checklist (at least one field true)
    const completedAny = checklists.filter((c: { checklist: Record<string, boolean> }) => {
      if (!c.checklist) return false;
      return Object.values(c.checklist).some(Boolean);
    }).length;

    // Count interns with 0 checklist items completed (all fields false or checklist missing)
    const zeroCompleted = checklists.filter((c: { checklist: Record<string, boolean> }) => {
      if (!c.checklist) return true;
      return Object.values(c.checklist).every((v: boolean) => !v);
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
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}
