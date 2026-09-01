import { NextRequest, NextResponse } from 'next/server';
import { supabase, createDeveloperProfile } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, password, projectId } = body;

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { error: 'Email, full name, and a password (min 6 characters) are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters in length.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Create or ensure developer profile in Supabase
    const { success, profile, error: dbError } = await createDeveloperProfile({
      email: cleanEmail,
      full_name: fullName.trim(),
      password: password,
      initial_project_id: projectId || undefined,
    });

    if (!success || !profile) {
      return NextResponse.json(
        { error: dbError || 'Failed to create developer profile in Supabase.' },
        { status: 500 }
      );
    }

    // 2. Send invitation email with credentials via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    let emailError: string | null = null;

    if (resendApiKey) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
              .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
              .header { text-align: center; margin-bottom: 24px; }
              .logo { display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #fff; font-weight: 800; font-size: 20px; padding: 8px 16px; border-radius: 10px; margin-bottom: 12px; }
              .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
              .sub { color: #64748b; font-size: 14px; margin-top: 6px; }
              .card { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #e2e8f0; }
              .card-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
              .card-row:last-child { margin-bottom: 0; }
              .label { color: #64748b; font-weight: 600; }
              .val { color: #0f172a; font-weight: 700; font-family: monospace; font-size: 15px; }
              .btn { display: block; text-align: center; background: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 24px; border-radius: 10px; margin-top: 24px; }
              .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">WorkPulse</div>
                <h1 class="title">You've been invited!</h1>
                <p class="sub">Administrator Muhammad Ashiq has invited you to join the engineering workspace.</p>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                Hello <strong>${fullName}</strong>,<br>
                Your developer account on WorkPulse is ready. Use the credentials below to sign in and submit your daily reports.
              </p>

              <div class="card">
                <div class="card-row">
                  <span class="label">Portal URL:</span>
                  <span class="val">http://localhost:3000/login</span>
                </div>
                <div class="card-row" style="margin-top: 10px;">
                  <span class="label">Your Email:</span>
                  <span class="val">${cleanEmail}</span>
                </div>
                <div class="card-row" style="margin-top: 10px;">
                  <span class="label">Temporary Password:</span>
                  <span class="val" style="background: #e2e8f0; padding: 2px 8px; border-radius: 6px; color: #2563eb;">${password}</span>
                </div>
              </div>

              <p style="font-size: 13px; color: #64748b; margin-top: 16px;">
                💡 Once logged in, you can update your profile, upload your avatar picture, track assigned projects, and file daily work reports.
              </p>

              <a href="http://localhost:3000/login" class="btn">Log In to Developer Portal →</a>

              <div class="footer">
                WorkPulse Engineering Workspace · Automated Invitation System
              </div>
            </div>
          </body>
          </html>
        `;

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'WorkPulse <onboarding@resend.dev>',
            to: cleanEmail,
            subject: 'Your WorkPulse Developer Portal Invitation & Password',
            html: emailHtml,
          }),
        });

        const resendData = await resendResponse.json();
        if (resendResponse.ok) {
          emailSent = true;
        } else {
          console.warn('Resend API response not OK:', resendData);
          emailError = resendData?.message || 'Email delivery failed (sandbox recipient domain restriction).';
        }
      } catch (mailErr: any) {
        console.error('Error calling Resend API:', mailErr);
        emailError = mailErr?.message || 'Network error sending email.';
      }
    } else {
      emailError = 'RESEND_API_KEY is not configured.';
    }

    return NextResponse.json({
      success: true,
      profile,
      emailSent,
      emailError,
      message: emailSent
        ? `Invitation and password successfully sent to ${cleanEmail}!`
        : `Developer created in Supabase. Password is: ${password} (Email note: ${emailError})`,
    });
  } catch (err: any) {
    console.error('Unexpected error in /api/developers/invite:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
