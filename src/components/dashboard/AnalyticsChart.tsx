'use client';

import React, { useState } from 'react';
import { TrendingUp, Calendar, Info } from 'lucide-react';

interface DataPoint {
  date: string;
  completion: number;
  submissions: number;
  highlight?: boolean;
}

const defaultData: DataPoint[] = [
  { date: 'Oct 26', completion: 10, submissions: 15 },
  { date: 'Oct 27', completion: 32, submissions: 18 },
  { date: 'Oct 28', completion: 74, submissions: 48 },
  { date: 'Oct 29', completion: 38, submissions: 62 },
  { date: 'Nov 00', completion: 55, submissions: 20 },
  { date: 'Nov 01', completion: 78, submissions: 91, highlight: true },
  { date: 'Nov 02', completion: 92, submissions: 88 },
];

export function AnalyticsChart() {
  const [data] = useState<DataPoint[]>(defaultData);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(5); // Default to Nov 01

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : data[5];

  // SVG dimensions
  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const pointsCompletion = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.completion / 100) * chartHeight;
    return { x, y, val: d.completion };
  });

  const pointsSubmissions = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.submissions / 100) * chartHeight;
    return { x, y, val: d.submissions };
  });

  // Create smooth bezier curve SVG paths
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
    }, '');
  };

  const pathCompletion = createSmoothPath(pointsCompletion);
  const pathSubmissions = createSmoothPath(pointsSubmissions);

  // Area paths for gradient fills
  const areaCompletion = `${pathCompletion} L ${pointsCompletion[pointsCompletion.length - 1].x},${height - paddingY} L ${pointsCompletion[0].x},${height - paddingY} Z`;
  const areaSubmissions = `${pathSubmissions} L ${pointsSubmissions[pointsSubmissions.length - 1].x},${height - paddingY} L ${pointsSubmissions[0].x},${height - paddingY} Z`;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Interactive Analytics</h2>
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Calendar className="h-3 w-3" /> Last 7 Days
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Project Completion Velocity & Report Submission Rate
        </p>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-blue-700">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-2xs" />
            <span>Daily Completion</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-2xs" />
            <span>Daily Submissions</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative mt-4 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = height - paddingY - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? 'none' : '3 3'}
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Filled Area paths */}
          <path d={areaCompletion} fill="url(#blueGradient)" />
          <path d={areaSubmissions} fill="url(#greenGradient)" />

          {/* Lines */}
          <path d={pathSubmissions} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <path d={pathCompletion} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

          {/* Active indicator vertical guideline */}
          {hoveredIdx !== null && (
            <line
              x1={pointsCompletion[hoveredIdx].x}
              y1={paddingY}
              x2={pointsCompletion[hoveredIdx].x}
              y2={height - paddingY}
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          )}

          {/* Data Points */}
          {pointsCompletion.map((pt, i) => (
            <circle
              key={`comp-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === i ? 5 : 3.5}
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:r-6"
              onMouseEnter={() => setHoveredIdx(i)}
            />
          ))}

          {pointsSubmissions.map((pt, i) => (
            <circle
              key={`sub-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === i ? 5 : 3.5}
              fill="#10B981"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:r-6"
              onMouseEnter={() => setHoveredIdx(i)}
            />
          ))}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * chartWidth;
            const isHovered = hoveredIdx === i;
            return (
              <text
                key={d.date}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className={`text-[10px] cursor-pointer transition-colors ${
                  isHovered ? 'fill-blue-700 font-bold' : 'fill-slate-500'
                }`}
                onClick={() => setHoveredIdx(i)}
              >
                {d.date}
              </text>
            );
          })}
        </svg>

        {/* Dynamic Tooltip Overlay Callouts matching mockup */}
        {activePoint && (
          <div className="absolute top-2 right-4 flex flex-col gap-1.5 animate-in fade-in">
            <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-lg text-[11px]">
              <span className="text-slate-400 font-medium">{activePoint.date}: </span>
              <span className="font-bold text-emerald-400">{activePoint.submissions}% Reports</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-lg text-[11px]">
              <span className="text-slate-400 font-medium">{activePoint.date}: </span>
              <span className="font-bold text-blue-400">{activePoint.completion}% Completion</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1 font-medium text-emerald-700">
          <TrendingUp className="h-3.5 w-3.5" /> +14.2% velocity this sprint
        </span>
        <span className="text-slate-400">Hover over any point to inspect dates</span>
      </div>
    </div>
  );
}
