'use client';

import React from 'react';
import { useApp } from '@/lib/auth-context';
import { Sparkles, TrendingUp } from 'lucide-react';

export function AnalyticsChart() {
  const { projects, workReports, developers } = useApp();

  const totalHours = workReports.reduce((acc, r) => acc + (Number(r.time_spent_hours) || 0), 0);
  const onTimeCount = workReports.filter((r) => r.is_on_time).length;
  const totalReports = workReports.length;
  const onTimePct = totalReports > 0 ? Math.round((onTimeCount / totalReports) * 100) : 0;

  // Group work by days of week dynamically from real submissions
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayHeights = days.map((day, idx) => {
    // Generate height from actual reports count or 0
    const count = workReports.filter((r) => {
      const date = new Date(r.report_date || r.submitted_at);
      const dayIndex = (date.getDay() + 6) % 7; // 0 = Mon
      return dayIndex === idx;
    }).length;
    return count > 0 ? Math.min(100, count * 25 + 20) : 8;
  });

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sprint Delivery Velocity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Calculated from actual developer work reports</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            <TrendingUp className="h-3.5 w-3.5" />
            {onTimePct}% On-Time
          </span>
        </div>

        {/* Real Summary Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Logged Hours</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalHours}h</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Reports Filed</p>
            <p className="text-xl font-extrabold text-blue-600 mt-0.5">{totalReports}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Active Devs</p>
            <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{developers.length}</p>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="mt-8 space-y-2">
          <div className="flex items-end justify-between gap-2 h-32 pt-4 px-2">
            {days.map((day, idx) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${
                    dayHeights[idx] > 10
                      ? 'bg-gradient-to-t from-blue-700 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-400'
                      : 'bg-slate-100'
                  }`}
                  style={{ height: `${dayHeights[idx]}%` }}
                  title={`${day}: ${workReports.length > 0 ? 'Logged activity' : '0 logs'}`}
                />
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Real-time Supabase sync</span>
        </span>
        <span className="font-semibold text-slate-800">{projects.length} Total Projects</span>
      </div>
    </div>
  );
}
