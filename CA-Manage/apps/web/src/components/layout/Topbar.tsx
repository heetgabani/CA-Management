'use client';
import { useState, useCallback } from 'react';
import { Bell, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { CommandPalette } from '@/components/features/search/CommandPalette';

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifCount] = useState(3);

  const handleLogout = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout, router]);

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex-1 max-w-lg">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 w-full max-w-sm px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#6B7280] hover:border-[#D1D5DB] transition-colors"
          >
            <Search size={15} />
            <span>Search clients, docs, tasks...</span>
            <kbd className="ml-auto text-[10px] bg-white border border-[#E5E7EB] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
            <Bell size={18} className="text-[#6B7280]" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#111827] leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-none capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</p>
              </div>
              <ChevronDown size={14} className="text-[#6B7280]" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 z-50">
                <Link href="/profile" onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB]">
                  <User size={15} /> Profile
                </Link>
                <Link href="/settings/general" onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB]">
                  <Settings size={15} /> Settings
                </Link>
                <div className="my-1 border-t border-[#E5E7EB]" />
                <button onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette open={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
