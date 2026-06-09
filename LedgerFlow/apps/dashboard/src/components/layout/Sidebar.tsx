'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, CheckSquare, Shield,
  Archive, Bell, Settings, ChevronLeft, ChevronRight,
  BarChart3, ClipboardList, Building2,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth.store';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/dashboard/clients', icon: Users },
  { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { label: 'Compliance', href: '/dashboard/compliance', icon: Shield },
  { label: 'Physical Files', href: '/dashboard/physical-files', icon: Archive },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Audit Logs', href: '/dashboard/audit-logs', icon: ClipboardList },
];

const bottomItems = [
  { label: 'Staff', href: '/dashboard/staff', icon: Building2 },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  useAuthStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col bg-[#F9FAFB] border-r border-[#E2E8F0] h-full overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[#E2E8F0] flex-shrink-0">
        <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">LF</span>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-[#1F2937] text-base truncate"
          >
            LedgerFlow
          </motion.span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              'sidebar-item',
              isActive(item.href) ? 'sidebar-item-active' : 'sidebar-item-inactive',
              collapsed && 'justify-center px-0',
            )}>
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="px-3 py-3 border-t border-[#E2E8F0] space-y-0.5">
        {bottomItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              'sidebar-item',
              isActive(item.href) ? 'sidebar-item-active' : 'sidebar-item-inactive',
              collapsed && 'justify-center px-0',
            )}>
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>
          </Link>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F1F5F9] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
