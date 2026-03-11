import Link from 'next/link';
import { containerStyles, textStyles } from '@/src/config/component-styles';

export default function NotFound() {
  return (
    <div className={`${containerStyles.page} ${containerStyles.flexCenter}`}>
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        {/* Brand-colored 404 */}
        <span className="text-brand text-[8rem] leading-none font-bold select-none">
          404
        </span>

        {/* Divider */}
        <div className="h-px w-16 bg-gray-200" />

        {/* Message */}
        <div className="flex flex-col gap-2">
          <h1 className={textStyles.heading.h4}>Page not found</h1>
          <p className={textStyles.body.small}>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="bg-brand hover:bg-brand/90 focus:ring-brand/20 mt-2 inline-flex h-9 items-center justify-center rounded-md px-5 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
