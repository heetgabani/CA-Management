'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, Trash2, FileText, CheckSquare, Shield, UserPlus } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';

const TYPE_ICON: Record<string, any> = {
  TASK_ASSIGNED:    { icon: CheckSquare, bg: '#DBEAFE', color: '#1D4ED8' },
  COMPLIANCE_DUE:   { icon: Shield,      bg: '#FEF9C3', color: '#A16207' },
  DOCUMENT_UPLOADED:{ icon: FileText,    bg: '#DCFCE7', color: '#15803D' },
  STAFF_INVITED:    { icon: UserPlus,    bg: '#F3E8FF', color: '#7E22CE' },
  SYSTEM_ALERT:     { icon: Bell,        bg: '#FEE2E2', color: '#B91C1C' },
};

export default function NotificationsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get('/notifications', { params: { limit: 50 } }).then(r => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => apiClient.patch('/notifications/mark-all-read'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); toast.success('All marked as read'); },
  });

  const notifications = data?.data ?? [];
  const unreadCount   = notifications.filter((n: any) => !n.isRead).length;

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#111827] border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" size="sm" icon={<CheckCheck size={13} />} onClick={() => markAllRead.mutate()}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Notifications will appear here." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => {
            const typeInfo = TYPE_ICON[n.type] ?? { icon: Bell, bg: '#F3F4F6', color: '#6B7280' };
            const Icon     = typeInfo.icon;
            return (
              <div
                key={n.id}
                className="flex items-start gap-4 p-4 rounded-2xl border transition-all"
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: n.isRead ? '#FFFFFF' : '#F8FAFF',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: typeInfo.bg }}
                >
                  <Icon size={16} style={{ color: typeInfo.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>{n.title}</p>
                  {n.body && <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{n.body}</p>}
                  <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                    {new Date(n.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markRead.mutate(n.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                    title="Mark as read"
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Check size={14} style={{ color: '#9CA3AF' }} />
                  </button>
                )}
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: '#3B82F6' }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
