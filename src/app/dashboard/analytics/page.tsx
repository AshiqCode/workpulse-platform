'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { useApp } from '@/lib/auth-context';
import { TrendingUp, Users, CheckCircle, Clock, Flame } from 'lucide-react';

export default function AnalyticsPage() {
  const { stats, developers, workReports } = useApp();

  return (
    <PaywallGate>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="pl-64">
          <Navbar />

          <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Team Analytics & Performance</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Historical trends, developer delivery velocity, and report timeliness metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <AnalyticsChart />
              </div>

              <div className="lg:col-span-4 space-y-5">
                {/* Compliance card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Report Submission Compliance</h3>
                  <p className="text-xs text-slate-500 mb-4">Overall team timeliness this sprint</p>

                  <div className="flex items-center justify-center py-4">
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-emerald-500 bg-emerald-50 text-emerald-950 font-black text-3xl shadow-inner">
                      <span>{stats.onTimeRatePct}%</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> On-Time: {stats.todaysReportsSubmitted}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" /> Delayed: {Math.max(0, stats.todaysReportsExpected - stats.todaysReportsSubmitted)}
                    </span>
                  </div>
                </div>

                {/* Developer Top Performers */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" /> Top Consistent Engineers
                  </h3>
                  {developers.length > 0 ? (
                    <div className="space-y-3">
                      {developers.slice(0, 3).map((dev, idx) => (
                        <div key={dev.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                            <img
                              src={dev.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={dev.full_name}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                            <span className="font-bold text-slate-800">{dev.full_name}</span>
                          </div>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {dev.on_time_rate_pct || 100}% On-Time
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No developer metrics recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PaywallGate>
  );
}
