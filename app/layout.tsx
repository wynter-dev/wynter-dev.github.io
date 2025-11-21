import Script from 'next/script';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { MainHeader } from '@/components/layout/main-header';
import { MainFooter } from '@/components/layout/main-footer';
import { Sidebar } from '@/components/layout/sidebar';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wynter Blog',
  description: 'Developer & Life Notes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
    <head>
      <meta name="google-adsense-account" content="ca-pub-6689558343928586" />
    </head>
    <body
      className={cn(
        'min-h-screen bg-background text-foreground antialiased font-sans',
        geistSans.variable,
        geistMono.variable
      )}
    >
    {/* Google AdSense */}
    <Script
      id="adsense-script"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6689558343928586"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />

    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative mx-auto w-full max-w-[1024px] px-4">
        <MainHeader />
        <Sidebar />
        <main className="min-h-[90vh] py-12 md:pl-56">
          {children}
        </main>
        <MainFooter />
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}
