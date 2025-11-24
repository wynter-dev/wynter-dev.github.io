import Script from 'next/script';
import type {Metadata} from 'next';
import '@/styles/globals.css';
import {cn} from '@/lib/utils';
import {ThemeProvider} from '@/components/theme-provider';
import {MainHeader} from '@/components/layout/main-header';
import {MainFooter} from '@/components/layout/main-footer';
import {Sidebar} from '@/components/layout/sidebar';
import {Geist_Mono} from 'next/font/google';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    {path: '../public/fonts/pretendard/Pretendard-Thin.woff2', weight: '100', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-ExtraLight.woff2', weight: '200', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-Light.woff2', weight: '300', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-Regular.woff2', weight: '400', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-Medium.woff2', weight: '500', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-SemiBold.woff2', weight: '600', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-Bold.woff2', weight: '700', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-ExtraBold.woff2', weight: '800', style: 'normal'},
    {path: '../public/fonts/pretendard/Pretendard-Black.woff2', weight: '900', style: 'normal'},
  ],
  variable: '--font-pretendard',
  display: 'swap',
});
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Wynter Blog',
  description: 'Developer & Life Notes',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
    <head>
      <meta name="google-adsense-account" content="ca-pub-6689558343928586" />
    </head>
    <body
      className={cn(
        'h-screen flex flex-col bg-background text-foreground antialiased font-sans',
        pretendard.variable,
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

    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}>
      <div className="relative mx-auto w-full max-w-[1024px] px-4">
        <MainHeader />
        <div className="flex flex-1 mx-auto w-full max-w-[1024px] px-4">
          <Sidebar />
          <main className="flex-1 relative overflow-y-auto py-12 md:pl-56">
            {children}
          </main>
        </div>

        <MainFooter />
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}
