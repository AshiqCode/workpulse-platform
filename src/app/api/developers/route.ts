import { NextRequest, NextResponse } from 'next/server';
import { getDevelopers } from '@/lib/supabase';

export async function GET() {
  try {
    const developers = await getDevelopers();
    return NextResponse.json({ success: true, developers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
