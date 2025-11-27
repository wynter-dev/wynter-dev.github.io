'use client';

import type {ReactNode} from 'react';
import {ThemeProvider} from '@/components/ThemeProvider';
import MainHeader from '@/components/layout/header/MainHeader';
import {MainFooter} from '@/components/layout/MainFooter';
import {Sidebar} from '@/components/layout/Sidebar';

export default function BlogLayout({children}: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}>
      <div className="relative h-screen overflow-hidden">
        <div className="mx-auto w-full max-w-screen-xl h-full relative">
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-screen-xl z-[999]">
            <MainHeader />
          </div>
          <div className="hidden md:block fixed top-16 left-[calc(50%-650px)] z-[900]">
            <div className="w-56 h-[calc(100vh-64px-56px-70px)] border-r bg-background overflow-y-auto">
              <Sidebar />
            </div>
          </div>
          <div className="hidden md:block fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-screen-xl z-[999]">
            <MainFooter />
          </div>
          <div className="pt-16 md:pl-54
                md:h-[calc(100vh-64px-56px)]
                h-full
                md:overflow-hidden overflow-y-auto">

            {/* PC */}
            <main className="hidden md:block h-full w-full overflow-y-auto mx-auto max-w-screen-xl md:p-8 p-4">
              {children}
            </main>

            {/* Mobile */}
            <div className="md:hidden flex flex-col min-h-[calc(100vh-64px)]">
              <main className="flex-1 overflow-y-auto mx-auto w-full max-w-screen-xl p-4">
                {children}
              </main>
              <MainFooter />
            </div>
          </div>

        </div>
      </div>
    </ThemeProvider>
  );
}
