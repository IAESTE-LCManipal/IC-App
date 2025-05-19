// app/api/slots/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Slot from '@/app/api/models/slot';

export async function GET() {
  try {
    await dbConnect();
    const slots = await Slot.find({});
    return NextResponse.json({ success: true, data: slots });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { slotNumber, from, to } = body;
    if (!slotNumber || !from || !to) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    const slot = await Slot.create({ slotNumber, from, to });
    return NextResponse.json({ success: true, data: slot }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
