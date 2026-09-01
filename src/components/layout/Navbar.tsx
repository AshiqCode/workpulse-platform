'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Plus, UserPlus, Sparkles, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

interface NavbarProps {
  onOpenInviteModal?: () => void;
  onOpenProjectModal?: () => void;
  onOpenPaywallModal?: () => void;
}

export function Navbar({ onOpenInviteModal, onOpenProjectModal, onOpenPaywallModal }: NavbarProps) {
  const { currentUser, switchUser, isPaidAdmin, setIsPaidAdmin } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
      {/* Left Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, developers, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-3.5">
        {/* Admin Access Status / Stripe Plan Badge */}
        {currentUser.role === 'admin' && (
          <div className="flex items-center">
            {isPaidAdmin ? (
              <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-xs">
                <span>Admin Access ($62 Paid - Lifetime Pro)</span>
                <span className="text-amber-500">👑</span>
              </div>
            ) : (
              <button
                onClick={onOpenPaywallModal}
                className="flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors animate-pulse"
              >
                <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                <span>Unlock Full Admin Access ($62)</span>
              </button>
            )}
          </div>
        )}

        {/* Quick Role Switcher for Pair Testing */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 text-xs font-medium">
          <button
            onClick={() => switchUser('admin')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
              currentUser.role === 'admin'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>
          <button
            onClick={() => switchUser('developer')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
              currentUser.role === 'developer'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Developer</span>
          </button>
        </div>

        {/* Admin Quick Action Buttons */}
        {currentUser.role === 'admin' ? (
          <>
            <button
              onClick={onOpenInviteModal}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-98"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Invite Developer</span>
            </button>

            <button
              onClick={onOpenProjectModal}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:border-slate-400 active:scale-98"
            >
              <Plus className="h-3.5 w-3.5 text-slate-600" />
              <span>New Project</span>
            </button>
          </>
        ) : (
          <Link
            href="/developer/portal"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-98"
          >
            <span>My Developer Workspace</span>
          </Link>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              3
            </span>
          </button>
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg p-1 transition hover:bg-slate-100"
          >
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={currentUser.full_name}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover shadow-xs"
            />
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.full_name}</p>
              <p className="text-[11px] text-slate-500 capitalize">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-bold text-slate-800">{currentUser.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/developer/portal"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Developer Work Portal
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Stripe Payment ($62 Plan)
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setIsPaidAdmin(!isPaidAdmin);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left rounded-lg px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50"
                >
                  Toggle $62 Paid Status ({isPaidAdmin ? 'Active' : 'Locked'})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
