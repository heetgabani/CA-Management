'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
          'bg-white border-b',
          scrolled ? 'border-[#E2E8F0] shadow-sm' : 'border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center">
                <span className="text-white font-black text-sm">LF</span>
              </div>
              <span className="text-lg font-bold text-[#1F2937] tracking-tight">
                LedgerFlow
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`${DASHBOARD_URL}/login`}
                className="text-sm font-medium px-4 py-2 text-[#64748B] hover:text-[#1F2937] rounded-lg transition-colors"
              >
                Sign in
              </a>
              <a
                href={`${DASHBOARD_URL}/register`}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors"
              >
                Start Free Trial
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-white border-b border-[#E2E8F0] shadow-md md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-[#64748B] hover:text-[#1F2937] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-[#E2E8F0] pt-3 mt-1 flex flex-col gap-2">
                <a href={`${DASHBOARD_URL}/login`} className="text-center py-2.5 text-sm font-medium text-[#64748B]">
                  Sign in
                </a>
                <a
                  href={`${DASHBOARD_URL}/register`}
                  className="text-center py-2.5 text-sm font-semibold bg-[#4F46E5] text-white rounded-lg"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
