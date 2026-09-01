'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2, RotateCw, TrendingUp } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

export function StatCards() {
  const { stats, projects, developers, workReports } = useApp();

  const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length || 14;
  const devCount = developers.length || 18;
  const reportsSubmitted = workReports.length || 16;
  const reportsExpected = devCount;
  const completionRate = Math.round((reportsSubmitted / (reportsExpected || 1)) * 100);

  const cards = [
    {
      title: 'Active Projects',
      value: activeProjectsCount,
      trend: `↑ ${stats.activeProjectsChangePct}%`,
      trendColor: 'text-emerald-600',
      trendBg: 'bg-emerald-50',
      icon: ArrowUpRight,
      subtext: 'vs last month',
    },
    {
      title: 'Assigned Developers',
      value: devCount,
      trend: `${devCount} Active`,
      trendColor: 'text-emerald-700',
      trendBg: 'bg-emerald-50',
      icon: CheckCircle2,
      subtext: 'all accounted for',
    },
    {
      title: "Today's Reports Received",
      value: `${reportsSubmitted}/${reportsExpected}`,
      trend: `${completionRate}% Submitted`,
      trendColor: 'text-blue-700',
      trendBg: 'bg-blue-50',
      icon: RotateCw,
      subtext: 'on-time compliance',
    },
    {
      title: 'Total Weekly Hours',
      value: `${stats.totalWeeklyHours}h`,
      trend: `+${stats.weeklyHoursChange}h vs Last Week`,
      trendColor: 'text-emerald-700',
      trendBg: 'bg-emerald-50',
      icon: TrendingUp,
      subtext: 'across team',
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
