'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, User, Camera, Building, Briefcase, Check, Save, Sparkles, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { uploadProfilePicture } from '@/lib/supabase';
import { UserAvatar } from '@/components/ui/UserAvatar';

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
  const { adminProfile, currentUser, updateAdminProfile, updateUserProfile } = useApp();
  
  // Active target user: either current logged in user or adminProfile
  const targetUser = currentUser || adminProfile;

  const [fullName, setFullName] = useState(targetUser.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(targetUser.avatar_url || '');
  const [company, setCompany] = useState(targetUser.company || 'Ashiq Dev Studio');
  const [bio, setBio] = useState(targetUser.bio || 'Lead Engineer & Administrator');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (targetUser) {
      setFullName(targetUser.full_name || '');
      setAvatarUrl(targetUser.avatar_url || '');
      setCompany(targetUser.company || 'Ashiq Dev Studio');
      setBio(targetUser.bio || 'Lead Engineer & Administrator');
    }
  }, [targetUser, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size must be under 5MB.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const res = await uploadProfilePicture(file, targetUser.id);
      if (res.success && res.publicUrl) {
        setAvatarUrl(res.publicUrl);
      } else {
        setErrorMsg(res.error || 'Failed to upload photo to Supabase Storage.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSaving(true);

    const updates = {
      full_name: fullName.trim(),
      avatar_url: avatarUrl || undefined,
      company: company.trim(),
      bio: bio.trim(),
    };

    let success = false;
    if (targetUser.role === 'admin') {
      success = await updateAdminProfile(updates);
    } else {
      success = await updateUserProfile(targetUser.id, updates);
    }

    setIsSaving(false);

    if (success) {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1200);
    } else {
      setErrorMsg('Failed to save profile changes to Supabase.');
    }
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
              <h3 className="text-base font-bold text-slate-900">
                {targetUser.role === 'admin' ? 'Admin Profile & Workspace Onboarding' : 'My Profile Settings'}
              </h3>
              <p className="text-xs text-slate-500">Real Supabase database persistence & Storage uploads</p>
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
            <h4 className="mt-3 text-lg font-bold text-slate-900">Profile Saved in Supabase!</h4>
            <p className="mt-1 text-xs text-slate-500">Your profile information and avatar have been permanently updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-5 space-y-5 text-xs">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-rose-700 border border-rose-200 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Avatar Preview & Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="relative">
                <UserAvatar
                  avatarUrl={avatarUrl}
                  name={fullName}
                  email={targetUser.email}
                  sizeClassName="h-16 w-16"
                  textSizeClassName="text-xl"
                  className="border-2 border-white shadow-md ring-2 ring-blue-500"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-full text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="font-bold text-slate-800 text-xs">Profile Picture</p>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 rounded-xl border border-blue-600 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload to Supabase Storage</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      Remove photo (Use Initials DP)
                    </button>
                  )}
                </div>

                {/* Presets */}
                <div className="pt-1">
                  <p className="text-[10px] text-slate-400 font-semibold mb-1">Or pick a preset avatar:</p>
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAvatarUrl(preset)}
                        className={`h-7 w-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                          avatarUrl === preset ? 'border-blue-600 ring-2 ring-blue-200 scale-105' : 'border-transparent'
                        }`}
                      >
                        <img src={preset} alt="preset" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
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
                <label className="block font-bold text-slate-700 mb-1">Account Email</label>
                <input
                  type="email"
                  readOnly
                  value={targetUser.email}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-slate-500 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Custom Avatar URL input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Custom Image URL (or upload above)</label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or paste link"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Company & Bio */}
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
                    placeholder="e.g. Full-Stack Developer"
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
                disabled={isSaving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save in Supabase</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
