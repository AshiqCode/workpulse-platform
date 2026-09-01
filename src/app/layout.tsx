import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'WorkPulse - Developer & Project Tracking Platform',
  description: 'Manage projects, assign developers, enforce scheduled daily work reports, and monitor real-time velocity analytics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
