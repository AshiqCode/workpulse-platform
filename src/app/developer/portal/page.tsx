'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  GitPullRequest,
  CheckSquare,
  Square,
  Flame,
  Activity,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  FileText,
  UserCheck
} from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { WorkReportModal } from '@/components/modals/WorkReportModal';

export default function DeveloperPortalPage() {
  const { currentUser, switchUser, projects, workReports, developers } = useApp();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<string>('01h 15m remaining');

  // Task checklist local state for interactive demo
  const [tasksState, setTasksState] = useState([
    { id: 1, text: 'Implement frontend UI components and review PR #12', completed: true, priority: 'High', project: 'Assigned Project' },
    { id: 2, text: 'Resolve pending unit test failures and database index optimization', completed: false, priority: 'High', project: 'Assigned Project' },
    { id: 3, text: 'Submit daily work report before 5:00 PM deadline', completed: false, priority: 'Medium', project: 'Assigned Project' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (id: number) => {
    setTasksState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const devUser = currentUser || {
    id: 'developer-guest',
    email: 'developer@example.com',
    full_name: 'Developer Member',
    role: 'developer' as const,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    total_hours_logged: 0,
  };

  // Find projects assigned to current developer
  const myProjects = projects.filter((p) =>
    (p.assigned_dev_ids || []).includes(devUser.id)
  );
  const displayProjects = myProjects.length > 0 ? myProjects : projects;

  // Current developer's reports
  const myReports = workReports.filter((r) => r.developer_id === devUser.id);
  const displayReports = myReports.length > 0 ? myReports : workReports;
  const onTimeCount = displayReports.filter((r) => r.is_on_time).length;
  const onTimePct = displayReports.length > 0 ? Math.round((onTimeCount / (displayReports.length || 1)) * 100) : 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Portal Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-semibold">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">Developer Work Portal</span>
          </div>
        </div>

        {/* Center Banner: Report Due Countdown */}
        <div className="hidden md:flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs text-emerald-900 font-medium">
          <Clock className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
          <span>
            Daily Report Due at <strong>5:00 PM</strong> (<span className="text-emerald-700 font-bold">{timeRemaining}</span>)
          </span>
        </div>

        {/* Right: Switch developer & Submit Report CTA */}
        <div className="flex items-center gap-3">
          {developers.length > 0 && (
            <select
              value={devUser.id}
              onChange={(e) => switchUser('developer', e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
            >
              {developers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setSelectedProjectId(displayProjects[0]?.id || '');
              setIsReportModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 active:scale-98 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit Daily Report</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Welcome greeting banner */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={devUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={devUser.full_name}
              className="h-14 w-14 rounded-full border-2 border-emerald-200 object-cover shadow-sm"
            />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Welcome back, {devUser.full_name} 👋
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Invited Engineer · You have <strong>{tasksState.filter((t) => !t.completed).length} pending items</strong> for today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Local Clock</p>
              <p className="text-xs font-mono font-bold text-slate-800">{currentTime || '05:00:00 PM'}</p>
            </div>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Open Report Dialog
            </button>
          </div>
        </div>

        {/* 2-Column Grid (Left: Tasks & Projects, Right: Developer Statistics) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tasks & Projects */}
          <div className="lg:col-span-8 space-y-6">
            {/* My Assigned Tasks Checklist */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Today's Assigned Tasks</h2>
                  <p className="text-xs text-slate-500">Check off items as you complete them before report submission</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                  {tasksState.filter((t) => t.completed).length}/{tasksState.length} Done
                </span>
              </div>

              <div className="space-y-2.5">
                {tasksState.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                      task.completed
                        ? 'border-emerald-200 bg-emerald-50/40 text-slate-500'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <button className="mt-0.5 text-slate-400">
                      {task.completed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-300" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.text}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500 font-medium">{task.project}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`font-semibold ${task.priority === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Assigned Projects Cards */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4">My Assigned Projects</h2>
              {displayProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayProjects.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-slate-900 text-xs">{p.name}</h3>
                        <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 capitalize">
                          {p.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{p.description || p.client_name}</p>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
                        <span>Daily Report Time:</span>
                        <span className="font-bold text-slate-800">
                          {p.scheduled_report_time ? p.scheduled_report_time.slice(0, 5) : '17:00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No projects assigned to you yet by the administrator.</p>
              )}
            </div>
          </div>

          {/* Right Column: Personal Statistics & Report History */}
          <div className="lg:col-span-4 space-y-6">
            {/* Personal Stats Widget */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Personal Performance</h2>

              {/* On-Time Rate Gauge */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-center">
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Monthly On-Time Rate</p>
                <div className="my-2 text-4xl font-black text-emerald-700">{onTimePct}%</div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900">
                  <CheckCircle2 className="h-3 w-3 text-emerald-700" /> Compliant Submissions
                </span>
              </div>

              {/* Total Hours Logged */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center">
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Total Hours Logged</p>
                <div className="my-2 text-3xl font-black text-blue-800">{devUser.total_hours_logged || 0} hrs</div>
                <p className="text-[10px] text-blue-600">Tracked across assigned deliverables</p>
              </div>

              {/* Weekly Activity Heatmap */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Weekly Activity Heatmap</span>
                  <span className="text-[10px] font-normal text-slate-400">M T W T F S S</span>
                </p>
                <div className="grid grid-cols-7 gap-1.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div
                      key={i}
                      className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        i < 5 ? 'bg-emerald-500 text-white shadow-2xs' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Report History */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-500" /> Recent Report History
              </h3>

              {displayReports.length > 0 ? (
                <div className="space-y-3">
                  {displayReports.map((report) => (
                    <div key={report.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate max-w-[150px]">
                          {report.project_name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            report.is_on_time ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {report.is_on_time ? 'Submitted' : 'Delayed'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{report.tasks_completed}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{report.report_date}</span>
                        <span>{report.time_spent_hours} hrs</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No reports submitted yet today.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <WorkReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultProjectId={selectedProjectId}
      />
    </div>
  );
}
