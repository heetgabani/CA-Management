'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit2, Calendar, User, Shield, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, any> = {
  PENDING:     { variant: 'warning', label: 'Pending' },
  IN_PROGRESS: { variant: 'info',    label: 'In Progress' },
  COMPLETED:   { variant: 'success', label: 'Completed' },
  FILED:       { variant: 'success', label: 'Filed' },
  OVERDUE:     { variant: 'danger',  label: 'Overdue' },
};

export default function ComplianceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();

  const { data: record, isLoading } = useQuery({
    queryKey: ['compliance-detail', id],
    queryFn: () => apiClient.get(`/compliance/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => apiClient.patch(`/compliance/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['compliance-detail', id] }); toast.success('Status updated'); },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#4F46E5] border-t-transparent" />
    </div>
  );

  if (!record) return null;

  const status = STATUS_MAP[record.status] ?? { variant: 'default', label: record.status };
  const dueDate = record.dueDate ? new Date(record.dueDate) : null;
  const diffDays = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: '#E2E8F0' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex-1">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Compliance / {record.type}</p>
          <h1 className="text-lg font-bold" style={{ color: '#1F2937' }}>{record.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={record.status}
            onChange={e => updateStatus.mutate(e.target.value)}
            className="h-8 px-2 text-xs rounded-lg border outline-none"
            style={{ borderColor: '#E2E8F0' }}
          >
            {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FILED'].map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <Button variant="secondary" size="sm" icon={<Edit2 size={12} />}>Edit</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2937' }}>Description</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#1F2937' }}>
            {record.description || 'No description provided.'}
          </p>

          {dueDate && diffDays !== null && diffDays >= 0 && diffDays <= 7 && record.status === 'PENDING' && (
            <div
              className="flex items-center gap-2 mt-5 p-3 rounded-xl"
              style={{ backgroundColor: '#FEF9C3', border: '1px solid #FDE68A' }}
            >
              <AlertTriangle size={15} style={{ color: '#A16207' }} />
              <p className="text-sm" style={{ color: '#92400E' }}>
                Due in <strong>{diffDays} day{diffDays !== 1 ? 's' : ''}</strong> — please complete this compliance.
              </p>
            </div>
          )}

          {dueDate && diffDays !== null && diffDays < 0 && record.status !== 'COMPLETED' && record.status !== 'FILED' && (
            <div
              className="flex items-center gap-2 mt-5 p-3 rounded-xl"
              style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
            >
              <AlertTriangle size={15} style={{ color: '#EF4444' }} />
              <p className="text-sm" style={{ color: '#DC2626' }}>
                Overdue by <strong>{Math.abs(diffDays)} day{Math.abs(diffDays) !== 1 ? 's' : ''}</strong>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-4 space-y-4" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#64748B' }}>Details</h3>
            {[
              { icon: Shield, label: 'Status', value: <Badge variant={status.variant} label={status.label} dot /> },
              { icon: Shield, label: 'Type', value: record.type },
              { icon: Calendar, label: 'Due Date', value: dueDate ? dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
              { icon: User, label: 'Assigned To', value: record.assignedTo ? `${record.assignedTo.firstName} ${record.assignedTo.lastName}` : 'Unassigned' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                <div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>{label}</p>
                  <div className="text-sm mt-0.5" style={{ color: '#1F2937' }}>{value}</div>
                </div>
              </div>
            ))}
            {record.client && (
              <div className="pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
                <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Client</p>
                <a href={`/clients/${record.client.id}`} className="text-sm font-medium hover:underline" style={{ color: '#1F2937' }}>
                  {record.client.displayName}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
