// app/api/interns/sro-checklist-status/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import SROChecklist from '@/app/api/models/sroChecklist';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const internID = url.searchParams.get('internID');
    if (!internID) {
      return NextResponse.json({ success: false, error: 'Missing internID' }, { status: 400 });
    }
    await dbConnect();
    const checklist = await SROChecklist.findOne({ internID });
    if (!checklist) {
      return NextResponse.json({ success: true, status: 'not started' });
    }
    const values = Object.values(checklist.checklist || {});
    if (values.length === 0) {
      return NextResponse.json({ success: true, status: 'not started' });
    }
    if (values.every(Boolean)) {
      return NextResponse.json({ success: true, status: 'completed' });
    }
    if (values.some(Boolean)) {
      return NextResponse.json({ success: true, status: 'ongoing' });
    }
    return NextResponse.json({ success: true, status: 'not started' });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
