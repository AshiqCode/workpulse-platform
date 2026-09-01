'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2, RotateCw, TrendingUp } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

export function StatCards() {
  const { stats, projects, developers, workReports } = useApp();

  // Pure real data directly from Supabase collections
  const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length;
  const devCount = developers.length;
  const reportsSubmitted = workReports.length;
  const reportsExpected = devCount;
  const completionRate = reportsExpected > 0 ? Math.round((reportsSubmitted / reportsExpected) * 100) : 0;
  const totalWeeklyHours = workReports.reduce((acc, r) => acc + (Number(r.time_spent_hours) || 0), 0);

  const cards = [
    {
      title: 'Active Projects',
      value: activeProjectsCount,
      trend: activeProjectsCount > 0 ? `↑ ${activeProjectsCount} Active` : '0 Active',
      trendColor: activeProjectsCount > 0 ? 'text-emerald-700' : 'text-slate-500',
      trendBg: activeProjectsCount > 0 ? 'bg-emerald-50' : 'bg-slate-100',
      icon: ArrowUpRight,
      subtext: 'live projects in pipeline',
    },
    {
      title: 'Assigned Developers',
      value: devCount,
      trend: devCount > 0 ? `${devCount} Active` : '0 Active',
      trendColor: devCount > 0 ? 'text-emerald-700' : 'text-slate-500',
      trendBg: devCount > 0 ? 'bg-emerald-50' : 'bg-slate-100',
      icon: CheckCircle2,
      subtext: 'active team roster',
    },
    {
      title: "Today's Reports Received",
      value: `${reportsSubmitted}/${reportsExpected}`,
      trend: `${completionRate}% Submitted`,
      trendColor: reportsSubmitted > 0 ? 'text-blue-700' : 'text-slate-500',
      trendBg: reportsSubmitted > 0 ? 'bg-blue-50' : 'bg-slate-100',
      icon: RotateCw,
      subtext: 'daily report compliance',
    },
    {
      title: 'Total Weekly Hours',
      value: `${totalWeeklyHours}h`,
      trend: `+${totalWeeklyHours}h Logged`,
      trendColor: totalWeeklyHours > 0 ? 'text-emerald-700' : 'text-slate-500',
      trendBg: totalWeeklyHours > 0 ? 'bg-emerald-50' : 'bg-slate-100',
      icon: TrendingUp,
      subtext: 'across entire team',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-300"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
            <div className="my-2.5 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">{card.value}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${card.trendBg} ${card.trendColor}`}>
                <Icon className="h-3 w-3" />
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
