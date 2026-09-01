'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Camera, Building, Briefcase, FileText, Check, Save, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
];

export function AdminProfileModal({ isOpen, onClose }: AdminProfileModalProps) {
  const { adminProfile, updateAdminProfile } = useApp();
  const [fullName, setFullName] = useState(adminProfile.full_name);
  const [avatarUrl, setAvatarUrl] = useState(adminProfile.avatar_url || AVATAR_PRESETS[0]);
  const [company, setCompany] = useState(adminProfile.company || 'Ashiq Dev Studio');
  const [bio, setBio] = useState(adminProfile.bio || 'Lead Engineer & Administrator');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (adminProfile) {
      setFullName(adminProfile.full_name);
      setAvatarUrl(adminProfile.avatar_url || AVATAR_PRESETS[0]);
      setCompany(adminProfile.company || 'Ashiq Dev Studio');
      setBio(adminProfile.bio || 'Lead Engineer & Administrator');
    }
  }, [adminProfile]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
      company,
      bio,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Admin Profile & Onboarding</h3>
              <p className="text-xs text-slate-500">Configure your personal workspace and profile identity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-12 text-center animate-in fade-in zoom-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-8 w-8" />
            </div>
            <h4 className="mt-3 text-lg font-bold text-slate-900">Profile Updated!</h4>
            <p className="mt-1 text-xs text-slate-500">Your admin identity and workspace branding have been saved.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-5 space-y-5 text-xs">
            {/* Avatar Preview & Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <img
                src={avatarUrl}
                alt="Admin Avatar"
                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-500"
              />
              <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-slate-800 text-xs mb-1.5">Choose Avatar Picture</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatarUrl(preset)}
                      className={`h-8 w-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                        avatarUrl === preset ? 'border-blue-600 ring-2 ring-blue-200 scale-105' : 'border-transparent'
                      }`}
                    >
                      <img src={preset} alt="preset" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Admin Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs font-semibold focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admin Email (Primary Owner)</label>
                <input
                  type="email"
                  readOnly
                  value="muhammadashiq.dev@gmail.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-slate-500 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Custom Avatar URL */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Custom Image URL (Optional)</label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://example.com/my-photo.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Company / Studio Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Workspace / Company</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Ashiq Dev Studio"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Headline</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Lead Engineer & Project Admin"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
