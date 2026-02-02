/**
 * User menu dropdown component with avatar and authentication options.
 *
 * Displays user information and provides sign-in/sign-out functionality.
 */
'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';
import { User, Settings } from 'lucide-react';
import { textStyles } from '@/src/config/component-styles';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />;
  }

  if (!session?.user) {
    return <SignInButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:border-brand focus:ring-brand/20 rounded-full focus:ring-2 focus:outline-none">
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              width={40}
              height={40}
              className="hover:ring-brand rounded-full ring-2 ring-gray-200 transition-all"
            />
          ) : (
            <div className="bg-brand hover:ring-brand flex h-10 w-10 items-center justify-center rounded-full text-white ring-2 ring-gray-200">
              <User className="h-5 w-5" />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className={textStyles.body.small}>{session.user.name}</p>
            <p className={`${textStyles.body.small} text-gray-500`}>
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <div className="w-full">
            <SignOutButton className="w-full justify-start" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
