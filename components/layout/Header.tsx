'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

const navItems = [
  { label: 'Početna', href: '/' },
  { label: 'O nama', href: '/o-nama' },
  { label: 'Naše knjige', href: '/knjige' },
  { label: 'Kontakt', href: '/kontakt' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    startTransition(() => setMobileOpen(false));
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled || mobileOpen
            ? 'bg-paper/95 backdrop-blur-md border-b border-border-fine'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/main-logo.png"
              alt="Art Rabic"
              width={100}
              height={40}
              className="h-10 md:h-12 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-red ${
                    isActive ? 'text-graphite border-b-[1.5px] border-brand-red pb-1' : 'text-muted'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              aria-label={mobileOpen ? 'Zatvori meni' : 'Otvori meni'}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden text-graphite hover:text-brand-red transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {mobileOpen
                ? <X className="w-5 h-5" strokeWidth={1.5} />
                : <Menu className="w-5 h-5" strokeWidth={1.5} />
              }
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-paper flex flex-col pt-20 md:hidden"
          >
            <nav className="flex flex-col px-6 pt-6 flex-1">
              {navItems.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.07 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center py-5 text-2xl font-serif border-b border-border-fine transition-colors ${
                        isActive ? 'text-brand-red' : 'text-graphite hover:text-brand-red'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-6 pb-12 pt-8">
              <p className="text-[10px] text-muted tracking-widest uppercase mb-3">Kontakt</p>
              <a href="mailto:info@artrabic.ba" className="text-graphite text-sm hover:text-brand-red transition-colors block">
                info@artrabic.ba
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
