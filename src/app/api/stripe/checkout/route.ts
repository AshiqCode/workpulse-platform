import { NextRequest, NextResponse } from 'next/server';
import { createAdminCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || 'admin@workpulse.io';
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const result = await createAdminCheckoutSession(email, origin);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
