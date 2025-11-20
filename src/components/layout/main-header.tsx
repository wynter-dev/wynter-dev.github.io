'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export function MainHeader() {
  const pathname = usePathname();
  const {theme, setTheme} = useTheme();
  const [open, setOpen] = useState(false);

  const navItems = [
    {href: '/', label: 'Home'},
    {href: '/blog', label: 'Blog'},
    {href: '/about', label: 'About'},
  ];

  const toggleTheme = () =>
    setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header
      className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
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
                  active && 'text-foreground font-medium',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-md border px-2 py-1 hover:bg-muted transition"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4"/>
            ) : (
              <Moon className="h-4 w-4"/>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            className="md:hidden rounded-md border px-2 py-1 hover:bg-muted transition"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-4 w-4"/>
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
