'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LayoutList, Kanban, Calendar, CheckSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { SearchInput } from '@/components/shared/SearchInput';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { useDebounce } from '@/lib/hooks/use-debounce';

const STATUS_COLORS: Record<string, any> = {
  PENDING:     { variant: 'warning', label: 'Pending' },
  IN_PROGRESS: { variant: 'info',    label: 'In Progress' },
  COMPLETED:   { variant: 'success', label: 'Completed' },
  CANCELLED:   { variant: 'danger',  label: 'Cancelled' },
};

const PRIORITY_COLORS: Record<string, any> = {
  LOW:      { variant: 'default', label: 'Low' },
  MEDIUM:   { variant: 'warning', label: 'Medium' },
  HIGH:     { variant: 'danger',  label: 'High' },
  CRITICAL: { variant: 'danger',  label: 'Critical' },
};

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export default function TasksPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const dSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', { search: dSearch, status, page }],
    queryFn: () => apiClient.get('/tasks', { params: { search: dSearch, status, page, limit: 20 } }).then(r => r.data),
    staleTime: 30_000,
  });

  const tasks = data?.data ?? [];
  const meta  = data?.meta ?? { total: 0 };

  const columns: Column<any>[] = [
    {
      key: 'title', label: 'Task', sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-sm" style={{ color: '#111827' }}>{row.title}</p>
          {row.client && <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{row.client.displayName}</p>}
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (row) => {
        const s = STATUS_COLORS[row.status] ?? { variant: 'default', label: row.status };
        return <Badge variant={s.variant} label={s.label} dot />;
      },
    },
    {
      key: 'priority', label: 'Priority',
      render: (row) => {
        const p = PRIORITY_COLORS[row.priority] ?? { variant: 'default', label: row.priority };
        return <Badge variant={p.variant} label={p.label} />;
      },
    },
    {
      key: 'assignee', label: 'Assigned To',
      render: (row) => row.assignee
        ? <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-medium text-[#374151]">
              {row.assignee.firstName?.[0]}{row.assignee.lastName?.[0]}
            </div>
            <span className="text-sm text-[#374151]">{row.assignee.firstName} {row.assignee.lastName}</span>
          </div>
        : <span className="text-sm text-[#9CA3AF]">Unassigned</span>,
    },
    {
      key: 'dueDate', label: 'Due Date',
      render: (row) => {
        if (!row.dueDate) return <span className="text-[#9CA3AF] text-sm">—</span>;
        const date = new Date(row.dueDate);
        const isOverdue = date < new Date() && row.status !== 'COMPLETED';
        return (
          <span className="text-sm" style={{ color: isOverdue ? '#DC2626' : '#374151' }}>
            {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Manage and track all firm tasks"
        actions={
          <Button icon={<Plus size={14} />} onClick={() => router.push('/tasks/new')}>
            New Task
          </Button>
        }
      />

      {/* Filters row */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        {/* Status tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setStatus(t.key); setPage(1); }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{
                backgroundColor: status === t.key ? '#FFFFFF' : 'transparent',
                color: status === t.key ? '#111827' : '#6B7280',
                boxShadow: status === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search tasks…" />
          {/* View toggle */}
          <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
            {([['list', LayoutList], ['kanban', Kanban]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="w-9 h-9 flex items-center justify-center transition-colors"
                style={{ backgroundColor: view === v ? '#111827' : '#FFFFFF', color: view === v ? '#FFFFFF' : '#9CA3AF' }}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5E7EB' }}>
        <DataTable
          columns={columns}
          data={tasks}
          loading={isLoading}
          onRowClick={(row) => router.push(`/tasks/${row.id}`)}
          keyExtractor={(row) => row.id}
          emptyTitle="No tasks yet"
          emptyDescription="Create your first task to start tracking work."
        />
        <div className="px-4 pb-2">
          <Pagination page={page} total={meta.total} limit={20} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
