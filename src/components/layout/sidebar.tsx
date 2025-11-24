'use client';

import Link from 'next/link';
import {cn} from '@/lib/utils';
import {usePathname} from 'next/navigation';
import {BookOpen, Folder, Home, Rss} from 'lucide-react';

const items = [
  {href: '/', label: 'Home', icon: Home},
  {href: '/blog', label: 'Blog', icon: BookOpen},
  {href: '/tags', label: 'Tags', icon: Folder},
  {href: '/rss.xml', label: 'RSS', icon: Rss},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:block w-56 absolute left-0 top-16
             h-[calc(100vh-64px)] border-r bg-background/50 backdrop-blur
             overflow-y-auto"
    >
      <nav className="px-6 py-6 space-y-2">
        {items.map(({href, label, icon: Icon}) => {
          const active =
            href === '/'
              ? pathname === '/'
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 text-sm px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition',
                active && 'bg-muted text-foreground font-medium'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
