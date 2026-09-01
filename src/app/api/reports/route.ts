import { NextRequest, NextResponse } from 'next/server';
import { submitWorkReport, getWorkReports } from '@/lib/supabase';

export async function GET() {
  try {
    const reports = await getWorkReports();
    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await submitWorkReport(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
