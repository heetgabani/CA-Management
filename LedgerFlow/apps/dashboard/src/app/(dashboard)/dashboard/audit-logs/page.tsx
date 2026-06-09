'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { SearchInput } from '@/components/shared/SearchInput';
import { Pagination } from '@/components/shared/Pagination';
import { useDebounce } from '@/lib/hooks/use-debounce';

const ACTION_COLORS: Record<string, any> = {
  CREATE: { variant: 'success', label: 'Create' },
  UPDATE: { variant: 'info',    label: 'Update' },
  DELETE: { variant: 'danger',  label: 'Delete' },
  LOGIN:  { variant: 'default', label: 'Login' },
  LOGOUT: { variant: 'default', label: 'Logout' },
  EXPORT: { variant: 'default', label: 'Export' },
  VIEW:   { variant: 'default', label: 'View' },
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);
  const [action, setAction] = useState('');
  const dSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', { search: dSearch, action, page }],
    queryFn: () => apiClient.get('/audit', { params: { search: dSearch, action, page, limit: 50 } }).then(r => r.data),
    staleTime: 15_000,
  });

  const logs = data?.data ?? [];
  const meta = data?.meta ?? { total: 0 };

  const columns: Column<any>[] = [
    {
      key: 'user', label: 'User',
      render: (row) => row.user
        ? <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#E2E8F0] flex items-center justify-center text-xs font-semibold">{row.user.firstName?.[0]}</div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#1F2937' }}>{row.user.firstName} {row.user.lastName}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{row.user.email}</p>
            </div>
          </div>
        : <span className="text-sm" style={{ color: '#9CA3AF' }}>System</span>,
    },
    {
      key: 'action', label: 'Action',
      render: (row) => {
        const a = ACTION_COLORS[row.action] ?? { variant: 'default', label: row.action };
        return <Badge variant={a.variant} label={a.label} />;
      },
    },
    {
      key: 'entityType', label: 'Entity',
      render: (row) => (
        <div>
          <p className="text-sm" style={{ color: '#1F2937' }}>{row.entityType}</p>
          {row.entityId && <p className="text-xs font-mono" style={{ color: '#9CA3AF' }}>{row.entityId.slice(-8)}</p>}
        </div>
      ),
    },
    {
      key: 'description', label: 'Description',
      render: (row) => <span className="text-sm" style={{ color: '#1F2937' }}>{row.description || '—'}</span>,
    },
    {
      key: 'ipAddress', label: 'IP Address',
      render: (row) => <span className="text-xs font-mono" style={{ color: '#64748B' }}>{row.ipAddress || '—'}</span>,
    },
    {
      key: 'createdAt', label: 'Time',
      render: (row) => (
        <span className="text-xs" style={{ color: '#64748B' }}>
          {new Date(row.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Complete activity trail for your firm" />

      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
          {[{ key: '', label: 'All' }, ...Object.keys(ACTION_COLORS).map(k => ({ key: k, label: ACTION_COLORS[k].label }))].map(t => (
            <button
              key={t.key}
              onClick={() => { setAction(t.key); setPage(1); }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{
                backgroundColor: action === t.key ? '#FFFFFF' : 'transparent',
                color: action === t.key ? '#4F46E5' : '#64748B',
                boxShadow: action === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search logs…" />
      </div>

      <div className="bg-white rounded-2xl border" style={{ borderColor: '#E2E8F0' }}>
        <DataTable
          columns={columns}
          data={logs}
          loading={isLoading}
          keyExtractor={(row) => row.id}
          emptyTitle="No audit logs"
          emptyDescription="Activity will appear here as actions are performed."
        />
        <div className="px-4 pb-2">
          <Pagination page={page} total={meta.total} limit={50} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
