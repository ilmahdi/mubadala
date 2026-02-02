/**
 * Sign-in page.
 *
 * Provides Google OAuth authentication interface.
 */
import { SignInButton } from '@/src/components/auth/SignInButton';
import { cardStyles, textStyles } from '@/src/config/component-styles';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className={`${cardStyles.default} w-full max-w-md`}>
        <div className="mb-8 text-center">
          <h1 className={`${textStyles.heading.h3} mb-2`}>Welcome to Jadwa</h1>
          <p className={`${textStyles.body.default} text-gray-600`}>
            Sign in to access trade management dashboard
          </p>
        </div>

        <SignInButton className="w-full" />

        <p
          className={`${textStyles.body.small} mt-6 text-center text-gray-500`}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
