'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  GitPullRequest,
  Activity,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  FileText,
  UserCheck,
  LogOut,
  Eye,
  ShieldCheck,
  FolderGit2,
  TrendingUp,
  Award,
  BarChart3,
  CalendarDays,
  Check,
  AlertCircle,
  Timer,
  Flame,
  Layers,
  Sparkle
} from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { WorkReportModal } from '@/components/modals/WorkReportModal';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { AdminProfileModal } from '@/components/modals/AdminProfileModal';
import { ViewReportModal } from '@/components/modals/ViewReportModal';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useRouter } from 'next/navigation';
import { WorkReport } from '@/types';

export default function DeveloperPortalPage() {
  const router = useRouter();
  const { currentUser, projects, workReports, logout } = useApp();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [viewingReport, setViewingReport] = useState<WorkReport | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isWindowOpen, setIsWindowOpen] = useState<boolean>(true);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDateFormatted(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));

      // Calculate time remaining until 5:00 PM local
      const deadline = new Date();
      deadline.setHours(17, 0, 0, 0);

      const diff = deadline.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${mins}m left`);
        setIsWindowOpen(true);
      } else {
        setTimeRemaining('Window Closed (Delayed)');
        setIsWindowOpen(false);
      }
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const devUser = currentUser || {
    id: 'developer-guest',
    email: 'developer@example.com',
    full_name: 'Developer Member',
    role: 'developer' as const,
    avatar_url: undefined,
    company: 'Engineering Workspace'
  };

  // Find projects assigned to current developer in Supabase.
  // Only show projects this developer is actually assigned to — never fall back to
  // the full workspace list (that made unassigned devs appear to have projects).
  const myProjects = projects.filter((p) =>
    (p.assigned_dev_ids || []).includes(devUser.id)
  );
  const displayProjects = myProjects;

  // Current developer's reports in Supabase
  const myReports = workReports.filter((r) => r.developer_id === devUser.id);
  const onTimeCount = myReports.filter((r) => r.is_on_time).length;
  const delayedCount = myReports.filter((r) => !r.is_on_time).length;
  const onTimePct = myReports.length > 0 ? Math.round((onTimeCount / myReports.length) * 100) : 0;
  const totalHoursLogged = myReports.reduce((acc, r) => acc + (Number(r.time_spent_hours) || 0), 0);
  const avgHoursPerReport = myReports.length > 0 ? (totalHoursLogged / myReports.length).toFixed(1) : '0';

  // Check if today's report already submitted
  const todayStr = new Date().toISOString().split('T')[0];
  const todayReport = myReports.find((r) => r.report_date === todayStr);
  const hasReportedToday = !!todayReport;

  // Day of week streak calculation
  const currentStreak = myReports.length;

  // Friendly, time-aware greeting
  const firstName = (devUser.full_name || 'there').split(' ')[0];
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <PaywallGate requiredRole="developer">
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Top Portal Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-semibold shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>
            <div className="hidden sm:block h-4 w-[1px] bg-slate-200" />
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-sm shadow-blue-500/25">
                <Activity className="h-4 w-4" />
              </div>
              <div className="truncate">
                <span className="font-black text-sm text-slate-900 tracking-tight">WorkPulse</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Developer Portal
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Profile & Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
              title="Edit Profile & Avatar"
            >
              <UserAvatar
                avatarUrl={devUser.avatar_url}
                name={devUser.full_name}
                email={devUser.email}
                sizeClassName="h-6 w-6"
                textSizeClassName="text-[9px]"
              />
              <span className="hidden md:inline">Edit Profile & DP</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 sm:px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <button
              onClick={() => {
                setSelectedProjectId(displayProjects[0]?.id || '');
                setIsReportModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 sm:px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 active:scale-98 transition"
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Submit Daily Work Report</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-8 max-w-[1500px] mx-auto space-y-6 sm:space-y-7">
          {/* Professional High-Tech Banner */}
          <div className="rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
            {/* Subtle Gradient Glow Overlays */}
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />
            <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Profile Identity Left */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative">
                  <UserAvatar
                    avatarUrl={devUser.avatar_url}
                    name={devUser.full_name}
                    email={devUser.email}
                    sizeClassName="h-16 w-16 sm:h-20 sm:w-20"
                    textSizeClassName="text-xl sm:text-2xl"
                    className="border-2 border-blue-400 shadow-md ring-4 ring-white/10"
                  />
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300/90">{greeting}, {firstName} 👋</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{devUser.full_name}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                      <UserCheck className="h-3.5 w-3.5" /> Active Engineer
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {devUser.email} {devUser.company ? `· ${devUser.company}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-blue-400" /> {currentDateFormatted} · Scheduled window before <strong>5:00 PM PST</strong>
                  </p>
                </div>
              </div>

              {/* Status Chips Right */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Live Time */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 px-4 py-3 min-w-[120px] text-center shadow-inner">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Time</p>
                  <p className="text-lg font-mono font-black text-white mt-0.5 tracking-tight">{currentTime || '...'}</p>
                </div>

                {/* Report Deadline */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 px-4 py-3 min-w-[140px] text-center shadow-inner">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Report Deadline</p>
                  <p className="text-sm font-black text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 5:00 PM Daily
                  </p>
                </div>

                {/* Today's Status */}
                {hasReportedToday ? (
                  <div className="rounded-2xl bg-emerald-950/80 border border-emerald-500/40 px-4 py-3 min-w-[140px] text-center shadow-inner">
                    <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Today's Status</p>
                    <p className="text-sm font-black text-emerald-400 mt-1 flex items-center justify-center gap-1">
                      <Check className="h-4 w-4 stroke-[3]" /> Report Filed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-amber-950/80 border border-amber-500/40 px-4 py-3 min-w-[140px] text-center shadow-inner">
                    <p className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Today's Status</p>
                    <p className="text-xs font-bold text-amber-300 mt-1 flex items-center justify-center gap-1">
                      <Timer className="h-3.5 w-3.5" /> {timeRemaining}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Today's Report Action Strip */}
          {myProjects.length > 0 && (
            hasReportedToday ? (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 sm:px-5 py-3.5 animate-in fade-in">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-emerald-900">Today's report is filed 🎉</p>
                  <p className="text-xs text-emerald-700">You're all caught up — great work, {firstName}!</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/70 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  <Flame className="h-3.5 w-3.5" /> {currentStreak} report{currentStreak === 1 ? '' : 's'} logged
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-5 py-3.5 animate-in fade-in">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${isWindowOpen ? 'bg-blue-600' : 'bg-amber-500'}`}>
                  <Timer className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">You haven't filed today's report yet</p>
                  <p className="text-xs text-slate-600">
                    {isWindowOpen
                      ? <><strong className="text-blue-700">{timeRemaining}</strong> until the 5:00 PM deadline.</>
                      : 'The on-time window has closed — file now to log a delayed report.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProjectId(displayProjects[0]?.id || '');
                    setIsReportModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 active:scale-98 transition shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Now</span>
                </button>
              </div>
            )
          )}

          {/* 4 Professional KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Assigned Projects */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Projects</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FolderGit2 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tight text-slate-900">{myProjects.length}</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{projects.length} available in workspace</p>
            </div>

            {/* Card 2: On-Time Rate */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Time Rate</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tight text-emerald-600">{onTimePct}%</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {onTimeCount} On-Time
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${onTimePct}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">{delayedCount} delayed submissions</p>
            </div>

            {/* Card 3: Total Logged Hours */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Hours</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tight text-indigo-600">{totalHoursLogged}h</span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  ~{avgHoursPerReport}h / rep
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Recorded across all sprints</p>
            </div>

            {/* Card 4: Submissions Filed */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reports Logged</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-black tracking-tight text-purple-600">{myReports.length}</span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Audit Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Immutable Supabase audit log</p>
            </div>
          </div>

          {/* Assigned Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900">Your Assigned Projects</h2>
                <p className="text-xs text-slate-500">Active project commitments and reporting deadlines</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                {displayProjects.length} Projects
              </span>
            </div>

            {displayProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-slate-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          {project.client_name}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 capitalize">
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">{project.name}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {project.description || 'Continuous project tracking & daily developer work reporting.'}
                      </p>

                      {/* Progress Bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Completion</span>
                          <span className="font-extrabold text-slate-900">{project.progress_pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              project.progress_pct === 100
                                ? 'bg-emerald-500'
                                : project.progress_pct > 60
                                ? 'bg-blue-600'
                                : 'bg-indigo-500'
                            }`}
                            style={{ width: `${project.progress_pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                      <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> Deadline: <strong className="text-slate-800">{project.scheduled_report_time || '5:00 PM'}</strong>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setIsReportModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-xl shadow-xs transition active:scale-98"
                      >
                        <span>File Report</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <FolderGit2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No projects currently assigned</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  When Administrator Muhammad Ashiq assigns you to projects, they will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Submissions History Table with Review Modal */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-900">Your Submitted Daily Work Reports</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click <strong>"Review Report"</strong> to inspect submitted logs (read-only audit trail).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                  {myReports.length} Reports Logged
                </span>
              </div>
            </div>

            {myReports.length > 0 ? (
              <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Date & Time</th>
                      <th className="pb-3 px-4">Project</th>
                      <th className="pb-3 px-4">Tasks Summary</th>
                      <th className="pb-3 px-4">Hours Logged</th>
                      <th className="pb-3 px-4">Timeliness</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myReports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/70 transition group">
                        <td className="py-3.5 pr-4">
                          <p className="font-mono font-bold text-slate-800">{rep.report_date}</p>
                          <p className="text-[10px] text-slate-400">{rep.submitted_at}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{rep.project_name}</td>
                        <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate" title={rep.tasks_completed}>
                          {rep.tasks_completed}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                            {rep.time_spent_hours}h
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {rep.is_on_time ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>On-Time</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                              Delayed
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pl-4 text-right">
                          <button
                            onClick={() => setViewingReport(rep)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-700 px-3 py-1.5 text-[11px] font-bold transition shadow-2xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Review Report</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden space-y-3">
                {myReports.map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => setViewingReport(rep)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition active:scale-[0.99] hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900 text-sm leading-tight">{rep.project_name}</p>
                      {rep.is_on_time ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> On-Time
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          <AlertCircle className="h-3 w-3" /> Delayed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{rep.tasks_completed}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
                      <span className="font-mono text-slate-400">{rep.report_date} · {rep.submitted_at}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">{rep.time_spent_hours}h</span>
                        <span className="flex items-center gap-1 font-bold text-slate-500"><Eye className="h-3.5 w-3.5" /> Review</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              </>
            ) : (
              <div className="py-14 text-center text-xs text-slate-400">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No daily reports filed yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Click the <strong>"Submit Daily Work Report"</strong> button above to file your first daily report.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <WorkReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          defaultProjectId={selectedProjectId}
        />

        <AdminProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />

        <ViewReportModal
          isOpen={!!viewingReport}
          onClose={() => setViewingReport(null)}
          report={viewingReport}
        />
      </div>
    </PaywallGate>
  );
}
