// app/api/interns/by-active-slot/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Intern from '@/app/api/models/intern';
import Slot from '@/app/api/models/slot';

// POST: { date: string (ISO) } or { slotNumber: string }
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    let { slotNumber, date } = body;

    // If date is not provided, use current IST date
    let nowIST: Date;
    if (!date) {
      const nowUTC = new Date();
      nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);
    } else {
      nowIST = new Date(date);
    }

    // Find all slots active at this date
    const slots = await Slot.find({ from: { $lte: nowIST }, to: { $gte: nowIST } });
    if (slotNumber) {
      // If slotNumber is provided, include it even if not active
      const slotNum = Number(slotNumber);
      if (!slots.some(s => s.slotNumber === slotNum)) {
        const extraSlot = await Slot.findOne({ slotNumber: slotNum });
        if (extraSlot) slots.push(extraSlot);
      }
    }
    if (!slots.length) {
      return NextResponse.json({ success: true, data: [] });
    }
    // For each slot, find all interns whose stay overlaps with the slot
    const slotDateRanges = slots.map(s => ({ from: s.from, to: s.to, slotNumber: s.slotNumber.toString().padStart(2, '0') }));

    // Find all interns whose stay overlaps with any of the slot's date ranges (regardless of sroSlot)
    const interns = await Intern.find({
      $or: slotDateRanges.map(({ from, to }) => ({
        startDate: { $lte: to },
        endDate: { $gte: from },
      })),
    }).select('-password');

    return NextResponse.json({ success: true, data: interns });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
