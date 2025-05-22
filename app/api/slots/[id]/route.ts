import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Slot from '@/app/api/models/slot';

export async function DELETE(request: Request, context: any) {
  await dbConnect();
  const { id } = context.params;
  try {
    const result = await Slot.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Slot not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
