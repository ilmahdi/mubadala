import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AuthProvider } from '@/src/components/auth/AuthProvider';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Mubadala - Trade Data Analysis Platform',
  description: 'Advanced trade data analysis platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
