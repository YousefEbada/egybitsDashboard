import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { DataProvider } from '@/context/DataContext';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'EgyBits Dashboard',
  description: 'Master control for EgyBits website',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <DataProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}