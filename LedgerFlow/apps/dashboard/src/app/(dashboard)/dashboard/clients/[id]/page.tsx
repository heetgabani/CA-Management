'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Edit2, Phone, Mail, MapPin, Building2,
  FileText, CheckSquare, Shield, Archive, StickyNote,
  Clock, User, Hash, Upload, FolderOpen,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Tabs } from '@/components/shared/Tabs';
import { DataTable, Column } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';

// ─────────────────────────────────────────────────────────
// Sub-tab components
// ─────────────────────────────────────────────────────────

function OverviewTab({ client }: { client: any }) {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#64748B' }}>{title}</h4>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="p-3 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
      <p className="text-xs mb-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: value ? '#1F2937' : '#CBD5E1' }}>{value || '—'}</p>
    </div>
  );

  return (
    <div>
      <Section title="Basic Details">
        <Field label="Client Code" value={client.clientCode} />
        <Field label="Client Type" value={client.clientType?.replace(/_/g, ' ')} />
        <Field label="Display Name" value={client.displayName} />
        <Field label="Business Name" value={client.businessName} />
        <Field label="Trade Name" value={client.tradeName} />
        <Field label="Status" value={client.status} />
      </Section>

      <Section title="Contact Details">
        <Field label="Primary Mobile" value={client.primaryMobile} />
        <Field label="Alternate Mobile" value={client.alternateMobile} />
        <Field label="Primary Email" value={client.primaryEmail} />
        <Field label="Alternate Email" value={client.alternateEmail} />
      </Section>

      <Section title="Tax Identifiers">
        <Field label="PAN" value={client.pan} />
        <Field label="Aadhaar" value={client.aadhaar ? '••••••••' + client.aadhaar.slice(-4) : null} />
        <Field label="GSTIN" value={client.gstin} />
        <Field label="TAN" value={client.tan} />
        <Field label="CIN" value={client.cin} />
        <Field label="LLPIN" value={client.llpin} />
      </Section>

      {(client.assignedPartner || client.assignedAccountant) && (
        <Section title="Assigned Staff">
          <Field label="Partner" value={client.assignedPartner ? `${client.assignedPartner.firstName} ${client.assignedPartner.lastName}` : undefined} />
          <Field label="Accountant" value={client.assignedAccountant ? `${client.assignedAccountant.firstName} ${client.assignedAccountant.lastName}` : undefined} />
        </Section>
      )}
    </div>
  );
}

function DocumentsTab({ clientId }: { clientId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['client-documents', clientId],
    queryFn: () => apiClient.get('/documents', { params: { clientId, limit: 50 } }).then(r => r.data),
    enabled: !!clientId,
  });

  const documents = data?.data ?? [];

  if (isLoading) return <div className="flex justify-center py-8"><div className="animate-spin w-5 h-5 rounded-full border-2 border-[#4F46E5] border-t-transparent" /></div>;

  if (!documents.length) return (
    <EmptyState icon={FolderOpen} title="No documents" description="Upload documents for this client." action={
      <Button size="sm" icon={<Upload size={12} />}>Upload Document</Button>
    } />
  );

  return (
    <div className="space-y-2">
      {documents.map((doc: any) => (
        <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl border transition-all" style={{ borderColor: '#E2E8F0' }}>
          <FileText size={16} style={{ color: '#64748B' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#1F2937' }}>{doc.originalName}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>{doc.category} · {(doc.fileSize / 1024).toFixed(1)} KB</p>
          </div>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>
            {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      ))}
    </div>
  );
}

function TasksTab({ clientId }: { clientId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['client-tasks', clientId],
    queryFn: () => apiClient.get('/tasks', { params: { clientId, limit: 20 } }).then(r => r.data),
    enabled: !!clientId,
  });

  const tasks = data?.data ?? [];
  const STATUS_MAP: Record<string, any> = {
    PENDING: { variant: 'warning', label: 'Pending' },
    IN_PROGRESS: { variant: 'info', label: 'In Progress' },
    COMPLETED: { variant: 'success', label: 'Completed' },
    CANCELLED: { variant: 'danger', label: 'Cancelled' },
  };

  if (isLoading) return <div className="flex justify-center py-8"><div className="animate-spin w-5 h-5 rounded-full border-2 border-[#4F46E5] border-t-transparent" /></div>;
  if (!tasks.length) return <EmptyState icon={CheckSquare} title="No tasks" description="Create a task for this client." />;

  return (
    <div className="space-y-2">
      {tasks.map((t: any) => {
        const s = STATUS_MAP[t.status] ?? { variant: 'default', label: t.status };
        return (
          <a key={t.id} href={`/tasks/${t.id}`} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-[#F9FAFB] transition-all" style={{ borderColor: '#E2E8F0' }}>
            <CheckSquare size={15} style={{ color: '#64748B' }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#1F2937' }}>{t.title}</p>
              {t.dueDate && <p className="text-xs" style={{ color: '#9CA3AF' }}>Due {new Date(t.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>}
            </div>
            <Badge variant={s.variant} label={s.label} />
          </a>
        );
      })}
    </div>
  );
}

function ComplianceTab({ clientId }: { clientId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['client-compliance', clientId],
    queryFn: () => apiClient.get('/compliance', { params: { clientId, limit: 20 } }).then(r => r.data),
    enabled: !!clientId,
  });

  const records = data?.data ?? [];
  const STATUS_MAP: Record<string, any> = {
    PENDING: { variant: 'warning', label: 'Pending' },
    IN_PROGRESS: { variant: 'info', label: 'In Progress' },
    COMPLETED: { variant: 'success', label: 'Completed' },
    FILED: { variant: 'success', label: 'Filed' },
    OVERDUE: { variant: 'danger', label: 'Overdue' },
  };

  if (isLoading) return <div className="flex justify-center py-8"><div className="animate-spin w-5 h-5 rounded-full border-2 border-[#4F46E5] border-t-transparent" /></div>;
  if (!records.length) return <EmptyState icon={Shield} title="No compliance records" description="Add a compliance deadline for this client." />;

  return (
    <div className="space-y-2">
      {records.map((r: any) => {
        const s = STATUS_MAP[r.status] ?? { variant: 'default', label: r.status };
        return (
          <a key={r.id} href={`/compliance/${r.id}`} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-[#F9FAFB] transition-all" style={{ borderColor: '#E2E8F0' }}>
            <Shield size={15} style={{ color: '#64748B' }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#1F2937' }}>{r.title}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{r.type} · Due {r.dueDate ? new Date(r.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</p>
            </div>
            <Badge variant={s.variant} label={s.label} />
          </a>
        );
      })}
    </div>
  );
}

function ActivityTab({ clientId }: { clientId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['client-activity', clientId],
    queryFn: () => apiClient.get(`/clients/${clientId}/timeline`).then(r => r.data.data),
    enabled: !!clientId,
  });

  const activities = data ?? [];

  if (isLoading) return <div className="flex justify-center py-8"><div className="animate-spin w-5 h-5 rounded-full border-2 border-[#4F46E5] border-t-transparent" /></div>;
  if (!activities.length) return <EmptyState icon={Clock} title="No activity" description="Activity will appear as changes are made." />;

  return (
    <div className="space-y-3">
      {activities.map((a: any, i: number) => (
        <div key={i} className="flex gap-3">
          <div className="w-2 flex flex-col items-center">
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#CBD5E1' }} />
            {i < activities.length - 1 && <div className="flex-1 w-px mt-1" style={{ backgroundColor: '#F1F5F9' }} />}
          </div>
          <div className="pb-3 flex-1">
            <p className="text-sm" style={{ color: '#1F2937' }}>{a.description}</p>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
              {new Date(a.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              {a.user && ` · ${a.user.firstName} ${a.user.lastName}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [tab, setTab] = useState('overview');

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => apiClient.get(`/clients/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#4F46E5] border-t-transparent" />
    </div>
  );

  if (!client) return (
    <div className="text-center py-16">
      <p style={{ color: '#64748B' }}>Client not found</p>
      <Button variant="ghost" onClick={() => router.back()} className="mt-4">Go back</Button>
    </div>
  );

  const tabs = [
    { key: 'overview',    label: 'Overview',       icon: <User size={13} /> },
    { key: 'documents',   label: 'Documents',      icon: <FileText size={13} /> },
    { key: 'compliance',  label: 'Compliance',     icon: <Shield size={13} /> },
    { key: 'tasks',       label: 'Tasks',          icon: <CheckSquare size={13} /> },
    { key: 'activity',    label: 'Activity',       icon: <Clock size={13} /> },
  ];

  return (
    <div className="max-w-5xl">
      {/* Top navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/dashboard/clients')}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: '#E2E8F0' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Clients / {client.clientCode}</p>
          <h1 className="text-lg font-bold truncate" style={{ color: '#1F2937' }}>{client.displayName}</h1>
        </div>
        <Button variant="secondary" size="sm" icon={<Edit2 size={12} />} onClick={() => router.push(`/clients/${id}/edit`)}>
          Edit
        </Button>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border p-5 mb-5 flex items-start gap-5" style={{ borderColor: '#E2E8F0' }}>
        <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold" style={{ color: '#1F2937' }}>
            {client.displayName?.[0]?.toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold" style={{ color: '#1F2937' }}>{client.displayName}</h2>
            <Badge
              variant={client.status === 'ACTIVE' ? 'success' : client.status === 'INACTIVE' ? 'default' : 'warning'}
              label={client.status}
              dot
            />
            <Badge variant="default" label={client.clientType?.replace(/_/g, ' ')} />
          </div>
          <div className="flex flex-wrap gap-4 mt-1">
            {client.primaryMobile && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                <Phone size={11} />{client.primaryMobile}
              </span>
            )}
            {client.primaryEmail && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                <Mail size={11} />{client.primaryEmail}
              </span>
            )}
            {client.pan && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                <Hash size={11} />PAN: {client.pan}
              </span>
            )}
            {client.gstin && (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                <Building2 size={11} />GST: {client.gstin}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Client since</p>
          <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
            {new Date(client.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="mt-5 bg-white rounded-2xl border p-5" style={{ borderColor: '#E2E8F0' }}>
        {tab === 'overview'   && <OverviewTab client={client} />}
        {tab === 'documents'  && <DocumentsTab clientId={id} />}
        {tab === 'compliance' && <ComplianceTab clientId={id} />}
        {tab === 'tasks'      && <TasksTab clientId={id} />}
        {tab === 'activity'   && <ActivityTab clientId={id} />}
      </div>
    </div>
  );
}
