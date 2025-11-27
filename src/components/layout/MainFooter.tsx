'use client';

import NoPrefetchLink from '@/components/NoPrefetchLink';

export function MainFooter() {
  return (
    <footer className="bg-background md:h-30 h-20 border-t flex flex-col items-center justify-center text-xs text-muted-foreground">
      <p>© 2025 wynter.log</p>
      <p className="text-xs">Built with Next.js · TailwindCSS · shadcn/ui</p>
      <NoPrefetchLink
        href="https://github.com/wynter-dev/wynter-dev"
        className="text-xs underline hover:text-foreground transition"
        target="_blank"
      >
        GitHub
      </NoPrefetchLink>
    </footer>
  );
}
