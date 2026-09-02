import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createDeveloperProfile } from '@/lib/supabase';

// Nodemailer (Gmail SMTP) needs the Node.js runtime, not the Edge runtime.
export const runtime = 'nodejs';

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

    // 2. Build the invitation email
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    const loginUrl = `${appUrl}/login`;
    const subject = `Welcome to WorkPulse! Your Developer Login & Credentials (${fullName})`;
    const emailHtml = buildInviteHtml({ fullName, cleanEmail, password, loginUrl });

    let emailSent = false;
    let emailError: string | null = null;
    let transport: 'gmail' | 'resend' | 'none' = 'none';

    // --- Preferred sender: Gmail SMTP via Nodemailer (free, delivers to ANY recipient) ---
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailPass) {
      transport = 'gmail';
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            // App Password (16 chars). Spaces are allowed; Gmail ignores them.
            pass: gmailPass.replace(/\s+/g, ''),
          },
        });

        await transporter.sendMail({
          from: `WorkPulse <${gmailUser}>`,
          to: cleanEmail,
          subject,
          html: emailHtml,
        });

        emailSent = true;
      } catch (mailErr: any) {
        console.error('Error sending email via Gmail SMTP:', mailErr);
        emailError =
          mailErr?.response ||
          mailErr?.message ||
          'Gmail SMTP send failed. Check GMAIL_USER and GMAIL_APP_PASSWORD (App Password, 2-Step Verification required).';
      }
    } else {
      // --- Fallback: Resend REST API (only if Gmail is not configured) ---
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'WorkPulse <onboarding@resend.dev>';

      if (resendApiKey) {
        transport = 'resend';
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from: fromEmail, to: cleanEmail, subject, html: emailHtml }),
          });

          const resendData = await resendResponse.json();
          if (resendResponse.ok) {
            emailSent = true;
          } else {
            emailError = resendData?.message || 'Email delivery failed via Resend.';
          }
        } catch (mailErr: any) {
          emailError = mailErr?.message || 'Network error sending email via Resend.';
        }
      } else {
        emailError =
          'No email sender configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local to send invites via Gmail.';
      }
    }

    return NextResponse.json({
      success: true,
      profile,
      emailSent,
      emailError,
      transport,
      message: emailSent
        ? `Invitation email successfully sent to ${cleanEmail}${transport === 'gmail' ? ' via Gmail' : ''}.`
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

function buildInviteHtml({
  fullName,
  cleanEmail,
  password,
  loginUrl,
}: {
  fullName: string;
  cleanEmail: string;
  password: string;
  loginUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WorkPulse Invitation</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 24px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .header { text-align: center; margin-bottom: 28px; }
        .logo { display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; font-weight: 900; font-size: 22px; padding: 10px 20px; border-radius: 12px; margin-bottom: 14px; letter-spacing: -0.5px; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
        .title { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.5px; }
        .sub { color: #64748b; font-size: 14px; margin-top: 6px; }
        .welcome-box { background: linear-gradient(to right, #eff6ff, #f8fafc); border: 1px solid #bfdbfe; border-radius: 14px; padding: 18px; margin: 20px 0; }
        .card { background: #0f172a; color: #f8fafc; border-radius: 16px; padding: 24px; margin: 24px 0; box-shadow: 0 4px 14px rgba(15,23,42,0.15); }
        .card-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 800; margin-bottom: 16px; border-bottom: 1px solid #334155; padding-bottom: 8px; }
        .card-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; }
        .card-row:last-child { margin-bottom: 0; }
        .label { color: #94a3b8; font-weight: 600; }
        .val { color: #ffffff; font-weight: 700; font-family: monospace; font-size: 15px; }
        .badge-pass { background: #1e293b; border: 1px solid #3b82f6; color: #60a5fa; padding: 4px 10px; border-radius: 8px; font-weight: 800; font-size: 16px; letter-spacing: 1px; }
        .btn { display: block; text-align: center; background: #2563eb; color: #ffffff !important; font-weight: 800; font-size: 15px; text-decoration: none; padding: 16px 24px; border-radius: 12px; margin-top: 24px; box-shadow: 0 4px 12px rgba(37,99,235,0.35); }
        .features { margin: 24px 0; background: #f8fafc; border-radius: 14px; padding: 18px; border: 1px solid #e2e8f0; font-size: 13px; color: #475569; }
        .feature-item { display: flex; align-items: center; margin-bottom: 8px; }
        .feature-item:last-child { margin-bottom: 0; }
        .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 28px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">WorkPulse</div>
          <h1 class="title">Developer Portal Invitation</h1>
          <p class="sub">Administrator Muhammad Ashiq has invited you to join the workspace.</p>
        </div>

        <div class="welcome-box">
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e3a8a;">
            👋 Hello <strong>${fullName}</strong>,<br>
            Your official developer account is now active on WorkPulse. Sign in using the credentials below to start reviewing assigned projects and filing your scheduled daily work reports.
          </p>
        </div>

        <div class="card">
          <div class="card-title">🔐 Your Sign-In Credentials</div>
          <div class="card-row">
            <span class="label">Login Portal:</span>
            <span class="val">${loginUrl}</span>
          </div>
          <div class="card-row">
            <span class="label">Your Email:</span>
            <span class="val">${cleanEmail}</span>
          </div>
          <div class="card-row">
            <span class="label">Your Password:</span>
            <span class="badge-pass">${password}</span>
          </div>
        </div>

        <div class="features">
          <div class="feature-item">⏱️ <strong>Scheduled Daily Reports:</strong> Submit daily progress before 5:00 PM PST.</div>
          <div class="feature-item">📊 <strong>Personal Analytics:</strong> Real-time on-time rate and total hours tracking.</div>
          <div class="feature-item">🎨 <strong>Custom Profile:</strong> Upload your avatar or enjoy your unique initials badge.</div>
        </div>

        <a href="${loginUrl}" class="btn">Sign In to Developer Portal →</a>

        <div class="footer">
          WorkPulse Engineering Workspace · Automated Invitation System<br>
          For support, contact <strong>muhammadashiq.dev@gmail.com</strong>
        </div>
      </div>
    </body>
    </html>
  `;
}
