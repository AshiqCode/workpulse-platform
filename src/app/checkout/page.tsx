'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Payment removed - automatically route to dashboard
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <p className="text-xs text-slate-500">Redirecting to Dashboard...</p>
    </div>
  );
}
