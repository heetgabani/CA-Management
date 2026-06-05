'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, UserPlus, Mail } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { SearchInput } from '@/components/shared/SearchInput';
import { Pagination } from '@/components/shared/Pagination';
import { Modal } from '@/components/shared/Modal';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { toast } from 'sonner';

const ROLE_MAP: Record<string, any> = {
  FIRM_OWNER:  { variant: 'purple', label: 'Firm Owner' },
  PARTNER:     { variant: 'info',   label: 'Partner' },
  MANAGER:     { variant: 'info',   label: 'Manager' },
  ACCOUNTANT:  { variant: 'default',label: 'Accountant' },
  EXECUTIVE:   { variant: 'default',label: 'Executive' },
  INTERN:      { variant: 'default',label: 'Intern' },
};

export default function StaffPage() {
  const router  = useRouter();
  const qc      = useQueryClient();
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole]   = useState('EXECUTIVE');
  const dSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['staff', { search: dSearch, page }],
    queryFn: () => apiClient.get('/users', { params: { search: dSearch, page, limit: 20 } }).then(r => r.data),
    staleTime: 30_000,
  });

  const invite = useMutation({
    mutationFn: (dto: any) => apiClient.post('/users/invite', dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff'] });
      setInviteOpen(false); setInviteEmail('');
      toast.success('Invitation sent');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to send invite'),
  });

  const staff = data?.data ?? [];
  const meta  = data?.meta ?? { total: 0 };

  const columns: Column<any>[] = [
    {
      key: 'name', label: 'Staff Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ color: '#374151' }}>
            {row.firstName?.[0]}{row.lastName?.[0]}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#111827' }}>{row.firstName} {row.lastName}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Role',
      render: (row) => {
        const r = ROLE_MAP[row.role] ?? { variant: 'default', label: row.role };
        return <Badge variant={r.variant} label={r.label} />;
      },
    },
    {
      key: 'status', label: 'Status',
      render: (row) => (
        <Badge
          variant={row.status === 'ACTIVE' ? 'success' : row.status === 'PENDING_VERIFICATION' ? 'warning' : 'default'}
          label={row.status === 'ACTIVE' ? 'Active' : row.status === 'PENDING_VERIFICATION' ? 'Pending' : 'Inactive'}
          dot
        />
      ),
    },
    {
      key: 'lastLoginAt', label: 'Last Active',
      render: (row) => row.lastLoginAt
        ? <span className="text-sm" style={{ color: '#6B7280' }}>{new Date(row.lastLoginAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
        : <span className="text-sm" style={{ color: '#9CA3AF' }}>Never</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Manage your firm's team members"
        actions={
          <Button icon={<UserPlus size={14} />} onClick={() => setInviteOpen(true)}>
            Invite Staff
          </Button>
        }
      />

      <div className="flex items-center justify-between mb-4">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search staff…" />
      </div>

      <div className="bg-white rounded-2xl border" style={{ borderColor: '#E5E7EB' }}>
        <DataTable
          columns={columns}
          data={staff}
          loading={isLoading}
          onRowClick={(row) => router.push(`/staff/${row.id}`)}
          keyExtractor={(row) => row.id}
          emptyTitle="No staff members yet"
          emptyDescription="Invite your first team member to get started."
        />
        <div className="px-4 pb-2">
          <Pagination page={page} total={meta.total} limit={20} onChange={setPage} />
        </div>
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Staff Member"
        description="Send an email invitation to join your firm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button
              loading={invite.isPending}
              onClick={() => inviteEmail && invite.mutate({ email: inviteEmail, role: inviteRole })}
              icon={<Mail size={13} />}
            >
              Send Invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Email Address *</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="staff@yourfirm.com"
              className="w-full h-9 px-3 text-sm rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Role</label>
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              className="w-full h-9 px-3 text-sm rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
            >
              {['PARTNER', 'MANAGER', 'ACCOUNTANT', 'EXECUTIVE', 'INTERN'].map(r => (
                <option key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
