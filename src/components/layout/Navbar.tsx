'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, UserPlus, ShieldCheck, ChevronDown, User, LogOut, Menu } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { AdminProfileModal } from '@/components/modals/AdminProfileModal';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface NavbarProps {
  onOpenInviteModal?: () => void;
  onOpenProjectModal?: () => void;
  onOpenProfileModal?: () => void;
  onOpenMobileMenu?: () => void;
}

export function Navbar({ onOpenInviteModal, onOpenProjectModal, onOpenProfileModal, onOpenMobileMenu }: NavbarProps) {
  const router = useRouter();
  const { currentUser, adminProfile, logout } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const activeUser = currentUser || adminProfile;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
        {/* Left: Mobile Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Mobile Menu Toggle Button */}
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="flex items-center justify-center p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, developers, work logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Right Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5 ml-2">
          {/* Admin Workspace Owner Badge */}
          {activeUser.role === 'admin' && (
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-900 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Workspace Owner: {adminProfile.full_name}</span>
            </div>
          )}

          {/* Admin Quick Action Buttons */}
          {activeUser.role === 'admin' ? (
            <>
              {onOpenInviteModal && (
                <button
                  onClick={onOpenInviteModal}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-98"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Invite Dev</span>
                </button>
              )}

              {onOpenProjectModal && (
                <button
                  onClick={onOpenProjectModal}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 sm:px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:border-slate-400 active:scale-98"
                >
                  <Plus className="h-3.5 w-3.5 text-slate-600" />
                  <span className="hidden sm:inline">New Project</span>
                </button>
              )}
            </>
          ) : (
            <Link
              href="/developer/portal"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-98"
            >
              <span>My Portal</span>
            </Link>
          )}

          {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-100"
            >
              <UserAvatar
                avatarUrl={activeUser.avatar_url}
                name={activeUser.full_name}
                email={activeUser.email}
                sizeClassName="h-8 w-8"
                textSizeClassName="text-[10px]"
                className="border border-slate-200 shadow-xs"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{activeUser.full_name}</p>
                <p className="text-[11px] text-slate-500 capitalize">{activeUser.role} · {activeUser.company || 'Workspace'}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-900">{activeUser.full_name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{activeUser.email}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{activeUser.company || 'Workspace Member'}</p>
                </div>
                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onOpenProfileModal) {
                        onOpenProfileModal();
                      } else {
                        setIsProfileModalOpen(true);
                      }
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 text-left font-medium"
                  >
                    <User className="h-3.5 w-3.5 text-blue-600" />
                    <span>Edit Profile & Avatar</span>
                  </button>

                  {activeUser.role === 'admin' ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/developer/portal"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Developer Work Portal
                    </Link>
                  )}
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
