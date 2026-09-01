'use client';

import React from 'react';
import { WorkReport } from '@/types';
import { Clock, CheckCircle2, AlertTriangle, ArrowUpRight, GitPullRequest, FileText } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { UserAvatar } from '@/components/ui/UserAvatar';

export function WorkLogTable() {
  const { workReports, developers } = useApp();

  // Pure real reports from Supabase
  const reportsToDisplay = workReports;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Developer Daily Work Logs</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time submissions recorded in Supabase</p>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
          {reportsToDisplay.length} Total Submissions
        </span>
      </div>

      {reportsToDisplay.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Developer</th>
                <th className="pb-3 px-4">Project & Tasks</th>
                <th className="pb-3 px-4">Time Spent</th>
                <th className="pb-3 px-4">Submission Status</th>
                <th className="pb-3 pl-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportsToDisplay.map((report) => (
                <tr key={report.id} className="group transition hover:bg-slate-50/70">
                  {/* Developer Profile with UserAvatar */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        avatarUrl={report.developer_avatar}
                        name={report.developer_name}
                        email={report.developer_email}
                        sizeClassName="h-9 w-9"
                        textSizeClassName="text-xs"
                        className="border border-slate-100 shadow-xs"
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{report.developer_name}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {report.developer_email || report.report_date}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Project & Tasks summary */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-slate-800 text-xs">{report.project_name}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={report.tasks_completed}>
                      {report.tasks_completed}
                    </p>
                  </td>

                  {/* Time Spent */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{report.time_spent_hours}h</span>
                    <p className="text-[10px] text-slate-400">at {report.submitted_at}</p>
                  </td>

                  {/* On-Time Compliance Badge */}
                  <td className="py-3.5 px-4">
                    {report.is_on_time ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>On-Time</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Delayed</span>
                      </span>
                    )}
                  </td>

                  {/* Links & PRs */}
                  <td className="py-3.5 pl-4 text-right">
                    {report.pr_commit_links ? (
                      <a
                        href={report.pr_commit_links}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/70 px-2.5 py-1 rounded-md"
                      >
                        <GitPullRequest className="h-3 w-3" />
                        <span>PR / Code</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Filed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Daily Work Logs Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            When invited developers submit their scheduled daily reports, their activity will stream here in real time.
          </p>
        </div>
      )}
    </div>
  );
}
