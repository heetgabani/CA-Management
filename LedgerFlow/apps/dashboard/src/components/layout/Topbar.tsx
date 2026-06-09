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
      <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex-1 max-w-lg">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 w-full max-w-sm px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F6F8FA] text-sm text-[#64748B] hover:border-[#CBD5E1] transition-colors"
          >
            <Search size={15} />
            <span>Search clients, docs, tasks...</span>
            <kbd className="ml-auto text-[10px] bg-white border border-[#E2E8F0] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
            <Bell size={18} className="text-[#64748B]" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F1F5F9] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#1F2937] leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-none capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</p>
              </div>
              <ChevronDown size={14} className="text-[#64748B]" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 z-50">
                <Link href="/profile" onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1F2937] hover:bg-[#F1F5F9]">
                  <User size={15} /> Profile
                </Link>
                <Link href="/dashboard/settings/general" onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1F2937] hover:bg-[#F1F5F9]">
                  <Settings size={15} /> Settings
                </Link>
                <div className="my-1 border-t border-[#E2E8F0]" />
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
