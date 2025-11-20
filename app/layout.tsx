import type { Metadata } from 'next';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { MainHeader } from '@/components/layout/main-header';
import { MainFooter } from '@/components/layout/main-footer';
import { Sidebar } from '@/components/layout/sidebar';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']});
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Wynter Blog',
  description: 'Developer & Life Notes',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko" suppressHydrationWarning>
    <body
      className={cn(
        'min-h-screen bg-background text-foreground antialiased font-sans',
        geistSans.variable,
        geistMono.variable,
      )}
    >
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MainHeader/>
      <Sidebar/>

      <main className="md:ml-56 min-h-[80vh] px-4 py-12 mx-auto max-w-5xl">
        {children}
      </main>

      <MainFooter/>
    </ThemeProvider>
    </body>
    </html>
  );
}
