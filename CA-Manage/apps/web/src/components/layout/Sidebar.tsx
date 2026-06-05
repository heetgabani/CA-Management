'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, CheckSquare, Shield,
  Archive, Bell, Settings, ChevronLeft, ChevronRight,
  BarChart3, ClipboardList, Building2, Search, FolderOpen,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth.store';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Compliance', href: '/compliance', icon: Shield },
  { label: 'Physical Files', href: '/physical-files', icon: Archive },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
];

const bottomItems = [
  { label: 'Staff', href: '/staff', icon: Building2 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col bg-white border-r border-[#E5E7EB] h-full overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[#E5E7EB] flex-shrink-0">
        <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">CA</span>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-[#111827] text-base truncate"
          >
            CA Manage
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
      <div className="px-3 py-3 border-t border-[#E5E7EB] space-y-0.5">
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
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
