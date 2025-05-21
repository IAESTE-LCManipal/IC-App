import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Slot from '@/app/api/models/slot';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const result = await Slot.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Slot not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
