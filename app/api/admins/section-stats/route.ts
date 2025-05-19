// app/api/admins/section-stats/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import LC from '@/app/api/models/lc';
import SROChecklist from '@/app/api/models/sroChecklist';
import Slot from '@/app/api/models/slot';

export async function POST() {
  try {
    await dbConnect();
    // Get current date in IST
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
    // Find the current slot
    const slot = await Slot.findOne({ from: { $lte: nowIST }, to: { $gte: nowIST } });
    if (!slot) {
      return NextResponse.json({ success: false, error: 'No active slot found.' }, { status: 404 });
    }
    // Get all interns in this slot
    const interns = await Intern.find({ sroSlot: slot.slotNumber });
    const internIDs = interns.map((i: any) => i.internID);
    // Get all checklists for these interns
    const checklists = await SROChecklist.find({ internID: { $in: internIDs } });
    // Count completed SRO checklists (all fields true)
    const completedSRO = checklists.filter((c: any) => c.checklist && Object.values(c.checklist).every(Boolean)).length;
    // Count interns with 0 checklist items completed (all fields false or checklist missing)
    const zeroCompleted = checklists.filter((c: any) => !c.checklist || Object.values(c.checklist).every(v => !v)).length;
    // Count LCs in this slot
    const lcsInSlot = await LC.countDocuments({ sroSlot: slot.slotNumber });
    return NextResponse.json({
      success: true,
      stats: {
        totalInterns: interns.length,
        completedSRO,
        zeroCompleted,
        lcsInSlot,
        slotNumber: slot.slotNumber,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
