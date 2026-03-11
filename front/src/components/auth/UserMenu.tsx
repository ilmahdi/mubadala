'use client';

import { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/src/hooks/use-auth';
import { SignInButton } from './SignInButton';
import {
  avatarStyles,
  combineStyles,
  textStyles,
} from '@/src/config/component-styles';

export function UserMenu() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  if (isLoading) {
    return (
      <div
        className={combineStyles(
          avatarStyles.base,
          avatarStyles.md,
          'animate-pulse bg-gray-200',
        )}
      />
    );
  }

  if (!isAuthenticated || !user) {
    return <SignInButton callbackUrl="/trades" />;
  }

  // Derive initials from name or email
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0] ?? '?').toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        className={combineStyles(
          avatarStyles.base,
          avatarStyles.md,
          avatarStyles.brand,
          avatarStyles.interactive,
          'focus:ring-brand/20 cursor-pointer focus:ring-2 focus:outline-none',
        )}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 z-(--z-index-dropdown) mt-2 w-fit min-w-52 rounded-md border border-gray-200 bg-white shadow-md"
          role="menu"
        >
          {/* User info */}
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <User size={16} className="shrink-0 text-gray-400" />
              <span
                className={combineStyles(textStyles.body.small, 'truncate')}
              >
                {user.name ?? user.email}
              </span>
            </div>
            {user.name && user.email && (
              <p
                className={combineStyles(
                  textStyles.caption,
                  'mt-0.5 truncate pl-6',
                )}
              >
                {user.email}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="p-1">
            <button
              className="focus:ring-brand/20 flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:outline-none"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: '/' });
              }}
            >
              <LogOut size={16} className="text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
