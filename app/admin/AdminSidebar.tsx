'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, ShoppingBag, MessageSquare, Mail, LogOut, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/admin', label: 'Kontrolna ploča', icon: LayoutDashboard, exact: true },
  { href: '/admin/books', label: 'Knjige', icon: BookOpen },
  { href: '/admin/orders', label: 'Narudžbe', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Poruke', icon: MessageSquare },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 min-h-screen bg-graphite flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="font-serif text-xl text-white">Art Rabic</h1>
        <p className="text-xs text-white/50 tracking-widest uppercase mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-red text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Pogledaj stranicu
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Odjavi se
        </button>
      </div>
    </aside>
  );
}
