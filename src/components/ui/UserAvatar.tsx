'use client';

import React, { useMemo } from 'react';

interface InitialsAvatarProps {
  name?: string;
  email?: string;
  sizeClassName?: string;
  textSizeClassName?: string;
  className?: string;
}

// Generates a deterministic, vibrant, unique gradient palette based on the string
function generateUniqueStyle(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 45) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${hue1}, 75%, 55%) 0%, hsl(${hue2}, 85%, 45%) 100%)`,
    boxShadow: `0 2px 8px hsla(${hue1}, 70%, 50%, 0.35)`,
  };
}

export function InitialsAvatar({
  name,
  email,
  sizeClassName = 'h-10 w-10',
  textSizeClassName = 'text-xs',
  className = '',
}: InitialsAvatarProps) {
  const displayName = name?.trim() || email?.split('@')[0] || 'User';

  const initials = useMemo(() => {
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
    }
    return 'U';
  }, [displayName]);

  const style = useMemo(() => generateUniqueStyle(displayName), [displayName]);

  return (
    <div
      style={style}
      className={`relative inline-flex items-center justify-center rounded-full font-bold text-white uppercase tracking-wider select-none shrink-0 ${sizeClassName} ${textSizeClassName} ${className}`}
      title={displayName}
    >
      <span>{initials}</span>
    </div>
  );
}

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string;
  email?: string;
  sizeClassName?: string;
  textSizeClassName?: string;
  className?: string;
  alt?: string;
}

export function UserAvatar({
  avatarUrl,
  name,
  email,
  sizeClassName = 'h-10 w-10',
  textSizeClassName = 'text-xs',
  className = '',
  alt,
}: UserAvatarProps) {
  // If no avatarUrl or avatarUrl is empty/null, render InitialsAvatar
  if (!avatarUrl || avatarUrl.trim() === '') {
    return (
      <InitialsAvatar
        name={name}
        email={email}
        sizeClassName={sizeClassName}
        textSizeClassName={textSizeClassName}
        className={className}
      />
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={alt || name || 'User Avatar'}
      className={`rounded-full object-cover shrink-0 ${sizeClassName} ${className}`}
      onError={(e) => {
        // Fallback gracefully if image fails to load
        (e.target as HTMLElement).style.display = 'none';
      }}
    />
  );
}
