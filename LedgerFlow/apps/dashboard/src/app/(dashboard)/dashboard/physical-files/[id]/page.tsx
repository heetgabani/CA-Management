'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowLeft, MapPin, User, Calendar, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, any> = {
  IN_OFFICE: { variant: 'success', label: 'In Office' },
  ISSUED:    { variant: 'warning', label: 'Issued Out' },
  MISSING:   { variant: 'danger',  label: 'Missing' },
  ARCHIVED:  { variant: 'default', label: 'Archived' },
};

export default function PhysicalFileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();
  const [issueModal, setIssueModal]   = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [issuedTo, setIssuedTo]       = useState('');
  const [reason, setReason]           = useState('');

  const { data: file, isLoading } = useQuery({
    queryKey: ['physical-file', id],
    queryFn: () => apiClient.get(`/physical-files/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  const recordMovement = useMutation({
    mutationFn: (dto: any) => apiClient.post(`/physical-files/${id}/movement`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['physical-file', id] });
      setIssueModal(false); setReturnModal(false);
      setIssuedTo(''); setReason('');
      toast.success('Movement recorded');
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#4F46E5] border-t-transparent" />
    </div>
  );

  if (!file) return null;

  const status = STATUS_MAP[file.status] ?? { variant: 'default', label: file.status };

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
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Physical Files</p>
          <h1 className="text-lg font-bold font-mono" style={{ color: '#1F2937' }}>{file.fileNumber}</h1>
        </div>
        <div className="flex gap-2">
          {file.status === 'IN_OFFICE' && (
            <Button size="sm" icon={<ArrowRight size={12} />} onClick={() => setIssueModal(true)}>
              Issue File
            </Button>
          )}
          {file.status === 'ISSUED' && (
            <Button variant="secondary" size="sm" onClick={() => setReturnModal(true)}>
              Return File
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Movement History */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#1F2937' }}>Movement History</h3>
            {file.movements?.length ? (
              <div className="space-y-3">
                {file.movements.map((m: any) => (
                  <div key={m.id} className="flex items-start gap-3 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <div className="w-7 h-7 rounded-full bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                      <ArrowRight size={12} style={{ color: '#64748B' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                          {m.action?.replace('_', ' ')}
                        </p>
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>
                          {new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {m.fromLocation && <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>From: {m.fromLocation}</p>}
                      {m.toLocation && <p className="text-xs" style={{ color: '#64748B' }}>To: {m.toLocation}</p>}
                      {m.reason && <p className="text-xs" style={{ color: '#9CA3AF' }}>{m.reason}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center py-6" style={{ color: '#9CA3AF' }}>No movement history yet</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-4 space-y-4" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#64748B' }}>File Details</h3>
            {[
              { icon: Badge as any, label: 'Status', value: <Badge variant={status.variant} label={status.label} dot /> },
              { icon: MapPin, label: 'Location', value: [file.cabinetNumber && `Cabinet ${file.cabinetNumber}`, file.shelfNumber && `Shelf ${file.shelfNumber}`, file.boxNumber && `Box ${file.boxNumber}`].filter(Boolean).join(', ') || file.location || '—' },
              { icon: User, label: 'Issued To', value: file.issuedToName || '—' },
              { icon: Calendar, label: 'Issued Date', value: file.issuedDate ? new Date(file.issuedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
              { icon: Calendar, label: 'Expected Return', value: file.expectedReturn ? new Date(file.expectedReturn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                <div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>{label}</p>
                  <div className="text-sm mt-0.5" style={{ color: '#1F2937' }}>{value}</div>
                </div>
              </div>
            ))}
            {file.client && (
              <div className="pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
                <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Client</p>
                <a href={`/clients/${file.client.id}`} className="text-sm font-medium hover:underline" style={{ color: '#1F2937' }}>
                  {file.client.displayName}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Issue File Modal */}
      <Modal
        open={issueModal}
        onClose={() => setIssueModal(false)}
        title="Issue File"
        description="Record who is taking this file out"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIssueModal(false)}>Cancel</Button>
            <Button loading={recordMovement.isPending} onClick={() => recordMovement.mutate({ action: 'ISSUED', issuedToName: issuedTo, reason, toLocation: 'EXTERNAL' })}>
              Issue
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2937' }}>Issued To *</label>
            <input value={issuedTo} onChange={e => setIssuedTo(e.target.value)} placeholder="Staff name or client name"
              className="w-full h-9 px-3 text-sm rounded-xl border outline-none" style={{ borderColor: '#E2E8F0' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2937' }}>Reason</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Purpose of issuing"
              className="w-full h-9 px-3 text-sm rounded-xl border outline-none" style={{ borderColor: '#E2E8F0' }} />
          </div>
        </div>
      </Modal>

      {/* Return File Modal */}
      <Modal
        open={returnModal}
        onClose={() => setReturnModal(false)}
        title="Return File"
        description="Record the return of this file"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReturnModal(false)}>Cancel</Button>
            <Button loading={recordMovement.isPending} onClick={() => recordMovement.mutate({ action: 'RETURNED', reason, toLocation: 'IN_OFFICE' })}>
              Confirm Return
            </Button>
          </>
        }
      >
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#1F2937' }}>Notes</label>
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Any notes about the return"
            className="w-full h-9 px-3 text-sm rounded-xl border outline-none" style={{ borderColor: '#E2E8F0' }} />
        </div>
      </Modal>
    </div>
  );
}
