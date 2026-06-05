'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, FileText, CheckSquare, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: () => apiClient.get(`/search?q=${debouncedQuery}`).then((r) => r.data.data),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (!open) {} }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => { if (!open) setQuery(''); }, [open]);

  const navigate = (href: string) => { router.push(href); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E7EB]">
              <Search size={17} className="text-[#9CA3AF] flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clients, documents, tasks..."
                className="flex-1 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent"
              />
              <button onClick={onClose} className="p-1 rounded hover:bg-[#F3F4F6]">
                <X size={15} className="text-[#9CA3AF]" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {data?.clients?.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider bg-[#F9FAFB]">Clients</p>
                  {data.clients.map((c: any) => (
                    <button key={c.id} onClick={() => navigate(`/clients/${c.id}`)}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F9FAFB] text-left">
                      <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xs font-semibold">
                        {c.displayName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{c.displayName}</p>
                        <p className="text-xs text-[#9CA3AF]">{c.clientCode} · {c.pan}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {data?.documents?.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider bg-[#F9FAFB]">Documents</p>
                  {data.documents.map((d: any) => (
                    <button key={d.id} onClick={() => navigate(`/clients/${d.clientId}/documents`)}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F9FAFB] text-left">
                      <FileText size={16} className="text-[#6B7280]" />
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{d.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{d.client?.displayName} · {d.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {debouncedQuery.length >= 2 && !data?.clients?.length && !data?.documents?.length && (
                <div className="text-center py-10 text-sm text-[#9CA3AF]">No results for "{debouncedQuery}"</div>
              )}

              {debouncedQuery.length < 2 && (
                <div className="text-center py-10 text-sm text-[#9CA3AF]">Type at least 2 characters to search</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
