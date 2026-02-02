import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AuthProvider } from '@/src/components/auth/AuthProvider';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Jadwa - Trade Management System',
  description: 'Advanced trade data analysis and management platform',
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
      </body>
    </html>
  );
}
