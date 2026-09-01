'use client';

import React, { useState } from 'react';
import { X, Mail, User, Check, Send, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

interface InviteDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteDeveloperModal({ isOpen, onClose }: InviteDeveloperModalProps) {
  const { inviteDeveloper, projects } = useApp();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    inviteDeveloper(email, fullName);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setEmail('');
      setFullName('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Invite Developer</h3>
              <p className="text-xs text-slate-500">Send an invitation to join projects and submit daily reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSent ? (
          <div className="py-10 text-center animate-in fade-in zoom-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-base font-bold text-slate-900">Invitation Sent!</h4>
            <p className="mt-1 text-xs text-slate-500">
              An invitation link has been dispatched to <span className="font-semibold text-slate-800">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Developer Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Mitchell"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="developer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Project Assignment</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.client_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 text-[11px] text-emerald-800">
              <span className="font-bold">✨ Free Developer Seat:</span> Developers join freely without extra payment under your active $62 Admin license.
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
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
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
