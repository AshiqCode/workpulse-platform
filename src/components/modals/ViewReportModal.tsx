'use client';

import React from 'react';
import { WorkReport } from '@/types';
import { X, Clock, CheckCircle2, AlertTriangle, GitPullRequest, FileText, User, Calendar, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useApp } from '@/lib/auth-context';

interface ViewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: WorkReport | null;
}

export function ViewReportModal({ isOpen, onClose, report }: ViewReportModalProps) {
  const { currentUser } = useApp();

  if (!isOpen || !report) return null;

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Daily Work Report Review</h3>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Read-Only Record
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Submitted for <strong className="text-slate-700">{report.project_name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notice: Read-only protection */}
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            <strong>Immutable Audit Trail:</strong> Submitted reports cannot be edited or deleted once recorded in Supabase to preserve accountability.
          </span>
        </div>

        {/* Developer & Submission Meta */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <UserAvatar
              avatarUrl={report.developer_avatar}
              name={report.developer_name}
              email={report.developer_email}
              sizeClassName="h-11 w-11"
              textSizeClassName="text-sm"
              className="border-2 border-white shadow-xs"
            />
            <div>
              <p className="font-bold text-slate-900 text-xs">{report.developer_name}</p>
              <p className="text-[11px] text-slate-500 font-mono">{report.developer_email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {report.is_on_time ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>On-Time Submission</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Delayed Submission</span>
              </span>
            )}
          </div>
        </div>

        {/* Report Details Grid */}
        <div className="mt-5 space-y-4 text-xs">
          {/* Key Metrics row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Report Date</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{report.report_date}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Time Submitted</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{report.submitted_at}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Hours Logged</p>
              <p className="text-sm font-extrabold text-blue-600 mt-0.5">{report.time_spent_hours}h</p>
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tasks Completed</p>
            <p className="text-slate-800 leading-relaxed whitespace-pre-line text-xs font-medium">
              {report.tasks_completed}
            </p>
          </div>

          {/* PR / Commit Link */}
          {report.pr_commit_links && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Code / PR Reference</p>
              <a
                href={report.pr_commit_links}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 underline text-xs break-all"
              >
                <GitPullRequest className="h-3.5 w-3.5 shrink-0" />
                <span>{report.pr_commit_links}</span>
              </a>
            </div>
          )}

          {/* Blockers */}
          {report.blockers && report.blockers !== 'None' && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Blockers & Dependencies</span>
              </p>
              <p className="text-amber-900 text-xs font-medium">{report.blockers}</p>
            </div>
          )}

          {/* Tomorrow's Plan */}
          {report.tomorrow_plan && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Next Planned Objectives</p>
              <p className="text-slate-800 text-xs font-medium">{report.tomorrow_plan}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
}
