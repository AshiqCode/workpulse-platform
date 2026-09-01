'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { WorkLogTable } from '@/components/dashboard/WorkLogTable';
import { PaywallGate } from '@/components/layout/PaywallGate';

export default function WorkLogsPage() {
  return (
    <PaywallGate requiredRole="admin">
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="pl-64">
          <Navbar />

          <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Work Logs & Daily Reports</h1>
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
