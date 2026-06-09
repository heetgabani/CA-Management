'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, Shield, Clock, CheckSquare } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';

const ROLE_MAP: Record<string, string> = {
  OWNER: 'Owner',
  PARTNER: 'Partner',
  MANAGER: 'Manager',
  SENIOR_ACCOUNTANT: 'Senior Accountant',
  ACCOUNTANT: 'Accountant',
  JUNIOR_ACCOUNTANT: 'Junior Accountant',
  INTERN: 'Intern',
};

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: member, isLoading } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => apiClient.get(`/users/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  const { data: tasksData } = useQuery({
    queryKey: ['staff-tasks', id],
    queryFn: () => apiClient.get('/tasks', { params: { assignedToId: id, limit: 10 } }).then(r => r.data),
    enabled: !!id,
  });

  const tasks = tasksData?.data ?? [];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#4F46E5] border-t-transparent" />
    </div>
  );

  if (!member) return (
    <div className="text-center py-16">
      <p style={{ color: '#64748B' }}>Staff member not found</p>
      <Button variant="ghost" onClick={() => router.back()} className="mt-4">Go back</Button>
    </div>
  );

  const fullName = `${member.firstName} ${member.lastName}`;
  const initials = `${member.firstName?.[0] ?? ''}${member.lastName?.[0] ?? ''}`.toUpperCase();
  const isActive = member.status === 'ACTIVE';

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/dashboard/staff')}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: '#E2E8F0' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          <ArrowLeft size={14} />
        </button>
        <div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Staff / {fullName}</p>
          <h1 className="text-lg font-bold" style={{ color: '#1F2937' }}>{fullName}</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border p-6 mb-5" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-bold"
            style={{ backgroundColor: '#F1F5F9', color: '#1F2937' }}>
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-base font-bold" style={{ color: '#1F2937' }}>{fullName}</h2>
              <Badge variant={isActive ? 'success' : 'default'} label={member.status} dot />
              <Badge variant="info" label={ROLE_MAP[member.role] ?? member.role} />
            </div>

            <div className="flex flex-wrap gap-4">
              {member.email && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                  <Mail size={11} />{member.email}
                </span>
              )}
              {member.phone && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                  <Phone size={11} />{member.phone}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {member.permissions?.map((p: string) => (
                <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono"
                  style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                  <Shield size={9} />{p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Open Tasks', value: tasks.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length },
          { label: 'Completed Tasks', value: tasks.filter((t: any) => t.status === 'COMPLETED').length },
          { label: 'Total Assigned', value: tasks.length },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border p-4 text-center" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-2xl font-bold" style={{ color: '#1F2937' }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Assigned tasks */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E2E8F0' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#1F2937' }}>Assigned Tasks</h3>
        {tasks.length === 0
          ? <EmptyState icon={CheckSquare} title="No tasks assigned" description="This staff member has no assigned tasks." />
          : (
            <div className="space-y-2">
              {tasks.map((t: any) => {
                const isPending = t.status === 'PENDING' || t.status === 'IN_PROGRESS';
                return (
                  <a key={t.id} href={`/tasks/${t.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border hover:bg-[#F9FAFB] transition-all"
                    style={{ borderColor: '#E2E8F0' }}>
                    <CheckSquare size={15} style={{ color: isPending ? '#F59E0B' : '#10B981' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#1F2937' }}>{t.title}</p>
                      {t.dueDate && (
                        <p className="text-xs flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                          <Clock size={10} />
                          Due {new Date(t.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={t.status === 'COMPLETED' ? 'success' : t.status === 'IN_PROGRESS' ? 'info' : 'warning'}
                      label={t.status.replace(/_/g, ' ')}
                    />
                  </a>
                );
              })}
            </div>
          )
        }
      </div>
    </div>
  );
}
