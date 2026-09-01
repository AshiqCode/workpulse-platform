'use client';

import React, { useState } from 'react';
import { WorkReport } from '@/types';
import { Clock, CheckCircle2, AlertCircle, ExternalLink, Filter, Download } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

interface WorkLogTableProps {
  reports?: WorkReport[];
  title?: string;
  showFilters?: boolean;
}

export function WorkLogTable({ reports, title = 'Developer Work Log Table', showFilters = false }: WorkLogTableProps) {
  const { workReports } = useApp();
  const list = reports || workReports;
  const [filterStatus, setFilterStatus] = useState<'all' | 'on_time' | 'delayed'>('all');
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);

  const filteredList = list.filter((r) => {
    if (filterStatus === 'on_time') return r.is_on_time;
    if (filterStatus === 'delayed') return !r.is_on_time;
    return true;
  });

  const exportCSV = () => {
    const headers = 'Developer,Project,Client,Scheduled Time,Submit Time,Status,Hours,Tasks\n';
    const rows = filteredList
      .map(
        (r) =>
          `"${r.developer_name}","${r.project_name}","${r.client_name}","${r.scheduled_time}","${r.submitted_at}","${
            r.is_on_time ? 'On-Time' : 'Delayed'
          }","${r.time_spent_hours}","${(r.tasks_completed || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workpulse-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live work logs and report timestamp compliance</p>
        </div>

        <div className="flex items-center gap-2">
          {showFilters && (
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
                }`}
              >
                All ({list.length})
              </button>
              <button
                onClick={() => setFilterStatus('on_time')}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  filterStatus === 'on_time' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-600'
                }`}
              >
                On-Time ({list.filter((r) => r.is_on_time).length})
              </button>
              <button
                onClick={() => setFilterStatus('delayed')}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  filterStatus === 'delayed' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-600'
                }`}
              >
                Delayed ({list.filter((r) => !r.is_on_time).length})
              </button>
            </div>
          )}

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 rounded-l-lg">Developer</th>
              <th className="py-3 px-4">Assigned Project</th>
              <th className="py-3 px-4">Scheduled Report Time</th>
              <th className="py-3 px-4">Actual Submit Time</th>
              <th className="py-3 px-4">Tasks Done</th>
              <th className="py-3 px-4 rounded-r-lg text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredList.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedReport(log)}
                className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                {/* Developer */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={log.developer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={log.developer_name || 'Developer'}
                      className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {log.developer_name}
                      </p>
                      <p className="text-[11px] text-slate-500">{log.time_spent_hours} hrs logged</p>
                    </div>
                  </div>
                </td>

                {/* Assigned Project */}
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  <span>{log.project_name || 'Nova App UI'}</span>
                  {log.client_name && (
                    <span className="block text-[11px] font-normal text-slate-400">{log.client_name}</span>
                  )}
                </td>

                {/* Scheduled Report Time */}
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{log.scheduled_time}</span>
                  </div>
                </td>

                {/* Actual Submit Time */}
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  <span>{log.submitted_at}</span>
                </td>

                {/* Tasks Done */}
                <td className="py-3.5 px-4 max-w-xs">
                  <p className="truncate font-medium text-slate-700">{log.tasks_completed}</p>
                  {log.pr_commit_links && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-0.5">
                      <ExternalLink className="h-2.5 w-2.5" />
                      {log.pr_commit_links}
                    </span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4 text-right">
                  {log.is_on_time ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      On-Time
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                      <AlertCircle className="h-3 w-3" />
                      Delayed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal on Log Click */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedReport.developer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={selectedReport.developer_name || ''}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                />
                <div>
                  <h3 className="font-bold text-slate-900">{selectedReport.developer_name}</h3>
                  <p className="text-xs text-slate-500">{selectedReport.project_name} · {selectedReport.report_date}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  selectedReport.is_on_time
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                {selectedReport.is_on_time ? 'On-Time Report' : 'Delayed Report'}
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-700">
              <div>
                <p className="font-bold text-slate-900 mb-1">Tasks Completed</p>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80 font-normal leading-relaxed">
                  {selectedReport.tasks_completed}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/80">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Time Spent</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{selectedReport.time_spent_hours} Hours</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/80">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Submission Time</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{selectedReport.submitted_at}</p>
                </div>
              </div>

              {selectedReport.pr_commit_links && (
                <div>
                  <p className="font-bold text-slate-900 mb-1">Pull Request / Commits</p>
                  <p className="rounded-lg bg-slate-50 p-2 border border-slate-200/80 text-blue-600 font-mono text-[11px]">
                    {selectedReport.pr_commit_links}
                  </p>
                </div>
              )}

              {selectedReport.blockers && (
                <div>
                  <p className="font-bold text-slate-900 mb-1">Blockers & Roadblocks</p>
                  <p className="rounded-lg bg-rose-50/50 p-2.5 border border-rose-100 text-rose-800">
                    {selectedReport.blockers}
                  </p>
                </div>
              )}

              {selectedReport.tomorrow_plan && (
                <div>
                  <p className="font-bold text-slate-900 mb-1">Tomorrow's Plan</p>
                  <p className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/80 font-normal">
                    {selectedReport.tomorrow_plan}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
