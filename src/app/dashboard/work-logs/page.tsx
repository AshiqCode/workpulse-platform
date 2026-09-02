'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { WorkLogTable } from '@/components/dashboard/WorkLogTable';
import { PaywallGate } from '@/components/layout/PaywallGate';

export default function WorkLogsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PaywallGate requiredRole="admin">
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto flex-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Work Logs & Daily Reports</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Complete historical record of submitted tasks, logged engineering hours, and timestamp compliance.
              </p>
            </div>

            <WorkLogTable />
          </main>
        </div>
      </div>
    </PaywallGate>
  );
}
