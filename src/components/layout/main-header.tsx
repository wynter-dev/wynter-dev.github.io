'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {Menu, Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import {startTransition, useEffect, useState} from 'react';
import {Github, Mail, PencilLine} from 'lucide-react';

export function MainHeader() {
  const pathname = usePathname();
  const {resolvedTheme, setTheme} = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  const navItems = [
    {href: '/', label: 'Home'},
    {href: '/blog', label: 'Blog'},
    {href: '/about', label: 'About'},
  ];

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-[1024px] flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          wynter.log
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm text-muted-foreground hover:text-foreground transition',
                  active && 'text-foreground font-medium'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="rounded-md border px-2 py-1 hover:bg-muted transition"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Link
              href="https://github.com/wynter-dev"
              target="_blank"
              className="flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-muted transition text-xs"
            >
              <Github className="h-3 w-3" /> GitHub
            </Link>

            <Link
              href="mailto:u0lee.dev@gmail.com"
              className="flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-muted transition text-xs"
            >
              <Mail className="h-3 w-3" /> Email
            </Link>

            <Link
              href="/blog"
              className="flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-muted transition text-xs"
            >
              <PencilLine className="h-3 w-3" /> Blog
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="https://github.com/wynter-dev"
              target="_blank"
              className="rounded-md border px-2 py-1 hover:bg-muted transition"
            >
              <Github className="h-4 w-4" />
            </Link>

            <Link
              href="mailto:u0lee.dev@gmail.com"
              className="rounded-md border px-2 py-1 hover:bg-muted transition"
            >
              <Mail className="h-4 w-4" />
            </Link>
          </div>
          <button
            className="md:hidden rounded-md border px-2 py-1 hover:bg-muted transition"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
