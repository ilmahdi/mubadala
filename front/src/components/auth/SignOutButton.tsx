/**
 * Sign-out button component.
 *
 * Handles user sign-out and redirects.
 */
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/src/components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  callbackUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({
  callbackUrl = '/',
  className,
  children,
}: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl });
  };

  return (
    <Button
      onClick={handleSignOut}
      className={className}
      variant="secondary"
      size="default"
      aria-label="Sign out"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {children || 'Sign out'}
    </Button>
  );
}
