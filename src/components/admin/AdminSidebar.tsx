'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AdminSidebarProps = {label: string; href: string; children?: AdminSidebarProps[]}

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu: AdminSidebarProps[] = [
    {label: '블로그 목록', href: '/admin/posts'},
    {label: '블로그 생성', href: '/admin/posts/new'},
    {label: '카테고리 관리', href: '/admin/categories'},
    {label: '사용자 통계', href: '/admin/analytics'},
  ];

  return (
    <aside className="admin-sidebar">
      {/* Title */}
      <div className="admin-title">
        <Link href="/admin" className="hover:text-gray-600">Admin</Link>
      </div>

      {/* Navigation */}
      <nav className="admin-nav space-y-2">
        {menu.map((item) => {
          const activeParent = pathname.startsWith(item.href);

          return (
            <div key={item.label}>
              {/* Parent item */}
              <Link href={item.href}>{item.label}</Link>
              {/* Children */}
              {item?.children && activeParent && (
                <ul className="mt-2 ml-4 space-y-2">
                  {item?.children.map((child) => {
                    return (
                      <li key={child.href}>
                        <Link href={child.href}>
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
