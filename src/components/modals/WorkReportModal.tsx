'use client';

import React, { useState } from 'react';
import { X, Send, Clock, GitPullRequest, AlertTriangle, Calendar, Check, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import confetti from 'canvas-confetti';

interface WorkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function WorkReportModal({ isOpen, onClose, defaultProjectId }: WorkReportModalProps) {
  const { projects, currentUser, submitReport } = useApp();
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [timeSpentHours, setTimeSpentHours] = useState('6.5');
  const [prLinks, setPrLinks] = useState('');
  const [blockers, setBlockers] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [submissionResult, setSubmissionResult] = useState<{ submitted: boolean; isOnTime: boolean } | null>(null);

  if (!isOpen) return null;

  const currentProj = projects.find((p) => p.id === projectId) || projects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasksCompleted || !projectId) return;

    const isOnTime = submitReport({
      project_id: projectId,
      tasks_completed: tasksCompleted,
      time_spent_hours: parseFloat(timeSpentHours) || 0,
      pr_commit_links: prLinks,
      blockers: blockers,
      tomorrow_plan: tomorrowPlan,
      developer_id: currentUser?.id || 'dev-anon',
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    setSubmissionResult({ submitted: true, isOnTime });

    setTimeout(() => {
      setSubmissionResult(null);
      setTasksCompleted('');
      setPrLinks('');
      setBlockers('');
      setTomorrowPlan('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit Daily Work Report</h3>
              <p className="text-xs text-slate-500">
                Scheduled daily submission deadline: <span className="font-semibold text-slate-700">{currentProj?.scheduled_report_time ? currentProj.scheduled_report_time.slice(0, 5) : '17:00'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submissionResult ? (
          <div className="py-12 text-center animate-in fade-in zoom-in">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                submissionResult.isOnTime ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Check className="h-7 w-7" />
            </div>
            <h4 className="mt-3 text-lg font-bold text-slate-900">Work Report Submitted!</h4>
            <p className="mt-1 text-xs text-slate-600">
              Logged as{' '}
              <span
                className={`font-bold ${
                  submissionResult.isOnTime ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {submissionResult.isOnTime ? 'On-Time (Compliant)' : 'Delayed'}
              </span>
              . Admin dashboard has been updated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* Project selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Assigned Project *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.client_name} (Due {p.scheduled_report_time ? p.scheduled_report_time.slice(0, 5) : '17:00'})
                  </option>
                ))}
              </select>
            </div>

            {/* Tasks completed */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tasks Completed Today *</label>
              <textarea
                rows={3}
                required
                placeholder="Implemented checkout UI, resolved JWT token expiration bug #415, and integrated stripe sheet..."
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Time spent & PR links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Time Spent Today (Hours) *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    required
                    value={timeSpentHours}
                    onChange={(e) => setTimeSpentHours(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pull Request / Commit Links</label>
                <div className="relative">
                  <GitPullRequest className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="github.com/org/repo/pull/104"
                    value={prLinks}
                    onChange={(e) => setPrLinks(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Blockers */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Blockers & Roadblocks (Optional)</label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                <textarea
                  rows={2}
                  placeholder="e.g. Waiting on API staging credentials from backend lead..."
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Tomorrow's Plan */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tomorrow's Plan</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  rows={2}
                  placeholder="e.g. Complete checkout webhook listener and conduct end-to-end sandbox purchase tests..."
                  value={tomorrowPlan}
                  onChange={(e) => setTomorrowPlan(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-98 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Work Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
