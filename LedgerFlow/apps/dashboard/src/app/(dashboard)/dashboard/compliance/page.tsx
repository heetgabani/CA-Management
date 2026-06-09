'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Shield, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { SearchInput } from '@/components/shared/SearchInput';
import { Pagination } from '@/components/shared/Pagination';
import { useDebounce } from '@/lib/hooks/use-debounce';

const STATUS_MAP: Record<string, any> = {
  PENDING:     { variant: 'warning', label: 'Pending' },
  IN_PROGRESS: { variant: 'info',    label: 'In Progress' },
  COMPLETED:   { variant: 'success', label: 'Completed' },
  OVERDUE:     { variant: 'danger',  label: 'Overdue' },
  FILED:       { variant: 'success', label: 'Filed' },
};

const TYPE_TABS = [
  { key: '', label: 'All' },
  { key: 'GST', label: 'GST' },
  { key: 'TDS', label: 'TDS' },
  { key: 'AUDIT', label: 'Audit' },
  { key: 'ROC', label: 'ROC' },
  { key: 'DSC', label: 'DSC' },
  { key: 'CUSTOM', label: 'Custom' },
];

export default function CompliancePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const dSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['compliance', { search: dSearch, type, page }],
    queryFn: () => apiClient.get('/compliance', { params: { search: dSearch, type, page, limit: 20 } }).then(r => r.data),
    staleTime: 30_000,
  });

  const records = data?.data ?? [];
  const meta    = data?.meta ?? { total: 0 };

  const columns: Column<any>[] = [
    {
      key: 'title', label: 'Compliance', sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-sm" style={{ color: '#1F2937' }}>{row.title}</p>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{row.type}</p>
        </div>
      ),
    },
    {
      key: 'client', label: 'Client',
      render: (row) => row.client
        ? <span className="text-sm" style={{ color: '#1F2937' }}>{row.client.displayName}</span>
        : <span className="text-sm" style={{ color: '#9CA3AF' }}>—</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (row) => {
        const s = STATUS_MAP[row.status] ?? { variant: 'default', label: row.status };
        return <Badge variant={s.variant} label={s.label} dot />;
      },
    },
    {
      key: 'dueDate', label: 'Due Date',
      render: (row) => {
        if (!row.dueDate) return <span className="text-sm" style={{ color: '#9CA3AF' }}>—</span>;
        const date = new Date(row.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((date.getTime() - today.getTime()) / 86400000);
        const isOverdue = diffDays < 0 && row.status !== 'COMPLETED' && row.status !== 'FILED';
        const isDueSoon = diffDays >= 0 && diffDays <= 7;
        return (
          <div className="flex items-center gap-1.5">
            {(isOverdue || isDueSoon) && <AlertTriangle size={12} style={{ color: isOverdue ? '#EF4444' : '#F59E0B' }} />}
            <span className="text-sm" style={{ color: isOverdue ? '#EF4444' : isDueSoon ? '#F59E0B' : '#1F2937' }}>
              {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        );
      },
    },
    {
      key: 'assignedTo', label: 'Assigned To',
      render: (row) => row.assignedTo
        ? <span className="text-sm" style={{ color: '#1F2937' }}>{row.assignedTo.firstName} {row.assignedTo.lastName}</span>
        : <span className="text-sm" style={{ color: '#9CA3AF' }}>Unassigned</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Compliance"
        subtitle="Track GST, TDS, ROC and other compliances"
        actions={
          <Button icon={<Plus size={14} />} onClick={() => router.push('/compliance/new')}>
            Add Compliance
          </Button>
        }
      />

      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
          {TYPE_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setType(t.key); setPage(1); }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{
                backgroundColor: type === t.key ? '#FFFFFF' : 'transparent',
                color: type === t.key ? '#4F46E5' : '#64748B',
                boxShadow: type === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search compliance…" />
      </div>

      <div className="bg-white rounded-2xl border" style={{ borderColor: '#E2E8F0' }}>
        <DataTable
          columns={columns}
          data={records}
          loading={isLoading}
          onRowClick={(row) => router.push(`/compliance/${row.id}`)}
          keyExtractor={(row) => row.id}
          emptyTitle="No compliance records"
          emptyDescription="Add your first compliance deadline to start tracking."
        />
        <div className="px-4 pb-2">
          <Pagination page={page} total={meta.total} limit={20} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
