'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Archive, MapPin } from 'lucide-react';
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
  IN_OFFICE:  { variant: 'success', label: 'In Office' },
  ISSUED:     { variant: 'warning', label: 'Issued Out' },
  MISSING:    { variant: 'danger',  label: 'Missing' },
  ARCHIVED:   { variant: 'default', label: 'Archived' },
};

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'IN_OFFICE', label: 'In Office' },
  { key: 'ISSUED', label: 'Issued Out' },
  { key: 'MISSING', label: 'Missing' },
];

export default function PhysicalFilesPage() {
  const router  = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage]     = useState(1);
  const dSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['physical-files', { search: dSearch, status, page }],
    queryFn: () => apiClient.get('/physical-files', { params: { search: dSearch, status, page, limit: 20 } }).then(r => r.data),
    staleTime: 30_000,
  });

  const files = data?.data ?? [];
  const meta  = data?.meta ?? { total: 0 };

  const columns: Column<any>[] = [
    {
      key: 'fileNumber', label: 'File Number', sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-sm font-mono" style={{ color: '#1F2937' }}>{row.fileNumber}</p>
          {row.description && <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{row.description}</p>}
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
      key: 'location', label: 'Location',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <MapPin size={12} style={{ color: '#9CA3AF' }} />
          <span className="text-sm" style={{ color: '#1F2937' }}>
            {[row.cabinetNumber && `Cabinet ${row.cabinetNumber}`, row.shelfNumber && `Shelf ${row.shelfNumber}`, row.boxNumber && `Box ${row.boxNumber}`].filter(Boolean).join(', ') || row.location || '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'issuedToName', label: 'Issued To',
      render: (row) => row.issuedToName
        ? <span className="text-sm" style={{ color: '#1F2937' }}>{row.issuedToName}</span>
        : <span className="text-sm" style={{ color: '#9CA3AF' }}>—</span>,
    },
    {
      key: 'issuedDate', label: 'Issued Date',
      render: (row) => row.issuedDate
        ? <span className="text-sm" style={{ color: '#1F2937' }}>{new Date(row.issuedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        : <span className="text-sm" style={{ color: '#9CA3AF' }}>—</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Physical Files"
        subtitle="Track and manage physical file inventory"
        actions={
          <Button icon={<Plus size={14} />} onClick={() => router.push('/physical-files/new')}>
            Register File
          </Button>
        }
      />

      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setStatus(t.key); setPage(1); }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
              style={{
                backgroundColor: status === t.key ? '#FFFFFF' : 'transparent',
                color: status === t.key ? '#4F46E5' : '#64748B',
                boxShadow: status === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search files…" />
      </div>

      <div className="bg-white rounded-2xl border" style={{ borderColor: '#E2E8F0' }}>
        <DataTable
          columns={columns}
          data={files}
          loading={isLoading}
          onRowClick={(row) => router.push(`/physical-files/${row.id}`)}
          keyExtractor={(row) => row.id}
          emptyTitle="No physical files registered"
          emptyDescription="Register your first physical file to start tracking."
        />
        <div className="px-4 pb-2">
          <Pagination page={page} total={meta.total} limit={20} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
