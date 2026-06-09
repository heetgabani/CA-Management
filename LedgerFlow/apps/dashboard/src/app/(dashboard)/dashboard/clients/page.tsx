'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Download, Upload, MoreHorizontal,
  User, Building2, Users, ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { ClientStatusBadge } from '@/components/features/clients/ClientStatusBadge';
import { ClientTypeBadge } from '@/components/features/clients/ClientTypeBadge';

const CLIENT_TYPES = ['ALL', 'INDIVIDUAL', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'TRUST', 'NGO'];

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [clientType, setClientType] = useState('ALL');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['clients', { page, search: debouncedSearch, clientType, status }],
    queryFn: () =>
      apiClient
        .get('/clients', {
          params: {
            page,
            limit: 20,
            search: debouncedSearch || undefined,
            clientType: clientType !== 'ALL' ? clientType : undefined,
            status: status || undefined,
          },
        })
        .then((r) => r.data),
  });

  const clients = data?.data || [];
  const meta = data?.meta;

  const handleSearchChange = (v: string) => {
    setSearch(v);
    clearTimeout((window as any)._searchTimer);
    (window as any)._searchTimer = setTimeout(() => {
      setDebouncedSearch(v);
      setPage(1);
    }, 400);
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937]">Clients</h1>
          <p className="text-sm text-[#64748B]">{meta?.total ?? 0} total clients</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
            <Download size={15} /> Export
          </button>
          <Link href="/dashboard/clients/new">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-sm font-medium hover:bg-[#4338CA] transition-colors">
              <Plus size={15} /> Add Client
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card-base p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, mobile, PAN, GSTIN..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F6F8FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Client type tabs */}
        <div className="flex gap-1 flex-wrap">
          {CLIENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => { setClientType(type); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                clientType === type
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F9FAFB]">
              <th className="text-left text-xs font-semibold text-[#64748B] px-4 py-3">Client</th>
              <th className="text-left text-xs font-semibold text-[#64748B] px-4 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-[#64748B] px-4 py-3">Contact</th>
              <th className="text-left text-xs font-semibold text-[#64748B] px-4 py-3">PAN / GSTIN</th>
              <th className="text-left text-xs font-semibold text-[#64748B] px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-[#64748B] px-4 py-3">Docs</th>
              <th className="text-right text-xs font-semibold text-[#64748B] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : clients.map((client: any) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#F1F5F9] hover:bg-[#F6F8FA] transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/clients/${client.id}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-semibold text-[#1F2937] flex-shrink-0">
                          {client.displayName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1F2937] group-hover:text-[#1F2937]">
                            {client.displayName}
                          </p>
                          <p className="text-xs text-[#9CA3AF]">{client.clientCode || client.fileNumber}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <ClientTypeBadge type={client.clientType} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#1F2937]">{client.primaryMobile || '—'}</p>
                      <p className="text-xs text-[#9CA3AF]">{client.primaryEmail || ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono text-[#1F2937]">{client.pan || '—'}</p>
                      <p className="text-xs font-mono text-[#9CA3AF]">{client.gstin || ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ClientStatusBadge status={client.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#1F2937]">{client._count?.documents ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-[#E2E8F0] opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={15} className="text-[#64748B]" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
          </tbody>
        </table>

        {!isLoading && clients.length === 0 && (
          <div className="text-center py-16">
            <Users size={40} className="mx-auto text-[#CBD5E1] mb-3" />
            <p className="text-sm font-medium text-[#1F2937]">No clients found</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Add your first client to get started</p>
            <Link href="/dashboard/clients/new">
              <button className="mt-4 px-4 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-medium hover:bg-[#4338CA]">
                Add Client
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#64748B]">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-medium text-[#1F2937] disabled:opacity-40 hover:bg-[#F9FAFB] transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-[#1F2937]">{page} / {meta.totalPages}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPages}
              className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-medium text-[#1F2937] disabled:opacity-40 hover:bg-[#F9FAFB] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
