import Link from 'next/link';

export function MainFooter() {
  return (
    <footer className="border-t mt-20">
      <div className="mx-auto max-w-5xl px-4 py-10 text-center text-sm text-muted-foreground space-y-2">
        <p>© {new Date().getFullYear()} wynter.log</p>
        <p className="text-xs">
          Built with Next.js · TailwindCSS · shadcn/ui
        </p>

        <Link
          href="https://github.com"
          className="text-xs underline hover:text-foreground transition"
          target="_blank"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}
