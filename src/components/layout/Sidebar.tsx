'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  BarChart3,
  UserCheck,
  Settings,
  Activity,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '@/lib/auth-context';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser } = useApp();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Developers', href: '/dashboard/developers', icon: Users },
    { name: 'Work Logs', href: '/dashboard/work-logs', icon: FileText },
    { name: 'Reports', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Team', href: '/dashboard/team', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white px-4 py-5 shadow-xs transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900">WorkPulse</span>
                <span className="ml-1 rounded-sm bg-blue-100 px-1 py-0.2 text-[10px] font-bold uppercase text-blue-700">Pro</span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onMobileClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100/90 text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
          {/* Developer Portal Switch banner */}
          <Link
            href="/developer/portal"
            onClick={onMobileClose}
            className="group flex items-center justify-between rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 p-3 transition hover:border-indigo-200 hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Dev Reporting</p>
                <p className="text-[11px] text-slate-500">Daily Standup Portal</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={onMobileClose}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              pathname === '/dashboard/settings'
                ? 'bg-slate-100 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
