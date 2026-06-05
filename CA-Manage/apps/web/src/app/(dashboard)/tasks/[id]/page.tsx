'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit2, Trash2, MessageSquare, Paperclip, Clock, User, Calendar, CheckSquare } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Tabs } from '@/components/shared/Tabs';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, any> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  IN_PROGRESS: { variant: 'info', label: 'In Progress' },
  COMPLETED: { variant: 'success', label: 'Completed' },
  CANCELLED: { variant: 'danger', label: 'Cancelled' },
};

const PRIORITY_COLORS: Record<string, any> = {
  LOW: { variant: 'default', label: 'Low' },
  MEDIUM: { variant: 'warning', label: 'Medium' },
  HIGH: { variant: 'danger', label: 'High' },
  CRITICAL: { variant: 'danger', label: 'Critical' },
};

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [comment, setComment] = useState('');

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => apiClient.get(`/tasks/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => apiClient.patch(`/tasks/${id}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['task', id] }); toast.success('Status updated'); },
  });

  const addComment = useMutation({
    mutationFn: (content: string) => apiClient.post(`/tasks/${id}/comments`, { content }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['task', id] }); setComment(''); toast.success('Comment added'); },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#111827] border-t-transparent" />
    </div>
  );

  if (!task) return (
    <div className="text-center py-16">
      <p style={{ color: '#6B7280' }}>Task not found</p>
      <Button variant="ghost" onClick={() => router.back()} className="mt-4">Go back</Button>
    </div>
  );

  const status = STATUS_COLORS[task.status] ?? { variant: 'default', label: task.status };
  const priority = PRIORITY_COLORS[task.priority] ?? { variant: 'default', label: task.priority };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'comments', label: 'Comments', count: task.comments?.length ?? 0 },
    { key: 'attachments', label: 'Attachments', count: task.attachments?.length ?? 0 },
    { key: 'activity', label: 'Activity' },
  ];

  const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ border: '1px solid #E5E7EB' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex-1">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Tasks / {task.id?.slice(-8)}</p>
          <h1 className="text-lg font-bold" style={{ color: '#111827' }}>{task.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={e => updateStatus.mutate(e.target.value)}
            className="h-8 px-2 text-xs rounded-lg border outline-none"
            style={{ borderColor: '#E5E7EB', color: '#374151' }}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <Button variant="secondary" size="sm" icon={<Edit2 size={12} />}>Edit</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main content */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5E7EB' }}>
            <Tabs tabs={tabs} active={tab} onChange={setTab} />

            <div className="mt-5">
              {tab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>DESCRIPTION</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                      {task.description || 'No description provided.'}
                    </p>
                  </div>
                  {task.comments?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2" style={{ color: '#6B7280' }}>RECENT COMMENTS</p>
                      {task.comments.slice(0, 3).map((c: any) => (
                        <div key={c.id} className="flex gap-3 mb-3">
                          <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {c.user?.firstName?.[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium" style={{ color: '#111827' }}>
                                {c.user?.firstName} {c.user?.lastName}
                              </span>
                              <span className="text-xs" style={{ color: '#9CA3AF' }}>
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: '#374151' }}>{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'comments' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {task.comments?.map((c: any) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {c.user?.firstName?.[0]}
                        </div>
                        <div className="flex-1 p-3 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium" style={{ color: '#111827' }}>
                              {c.user?.firstName} {c.user?.lastName}
                            </span>
                            <span className="text-xs" style={{ color: '#9CA3AF' }}>
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#374151' }}>{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Add a comment…"
                      className="flex-1 h-9 px-3 text-sm rounded-xl border outline-none"
                      style={{ borderColor: '#E5E7EB' }}
                      onKeyDown={e => { if (e.key === 'Enter' && comment.trim()) addComment.mutate(comment.trim()); }}
                    />
                    <Button
                      size="sm"
                      onClick={() => comment.trim() && addComment.mutate(comment.trim())}
                      loading={addComment.isPending}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              )}

              {tab === 'attachments' && (
                <div>
                  {task.attachments?.length ? (
                    task.attachments.map((a: any) => (
                      <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border mb-2" style={{ borderColor: '#E5E7EB' }}>
                        <Paperclip size={14} style={{ color: '#9CA3AF' }} />
                        <span className="text-sm flex-1" style={{ color: '#374151' }}>{a.fileName}</span>
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>{(a.fileSize / 1024).toFixed(1)} KB</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center py-8" style={{ color: '#9CA3AF' }}>No attachments</p>
                  )}
                </div>
              )}

              {tab === 'activity' && (
                <p className="text-sm py-8 text-center" style={{ color: '#9CA3AF' }}>Activity log coming soon</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-4 space-y-4" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Details</h3>

            {[
              { icon: CheckSquare, label: 'Status', value: <Badge variant={status.variant} label={status.label} dot /> },
              { icon: User, label: 'Assigned To', value: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned' },
              { icon: Calendar, label: 'Due Date', value: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
              { icon: Clock, label: 'Created', value: new Date(task.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                <div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>{label}</p>
                  <div className="text-sm mt-0.5" style={{ color: '#374151' }}>{value}</div>
                </div>
              </div>
            ))}

            {task.priority && (
              <div className="flex items-start gap-3">
                <div className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 rounded-full" style={{ backgroundColor: priority.variant === 'danger' ? '#FEE2E2' : '#FEF9C3' }} />
                <div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Priority</p>
                  <Badge variant={priority.variant} label={priority.label} className="mt-0.5" />
                </div>
              </div>
            )}

            {task.client && (
              <div className="pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Client</p>
                <a
                  href={`/clients/${task.client.id}`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#111827' }}
                >
                  {task.client.displayName}
                </a>
                {task.client.clientCode && (
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{task.client.clientCode}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
