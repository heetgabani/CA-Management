'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/shared/Button';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  dueDate: z.string().optional(),
  clientId: z.string().optional(),
  assigneeId: z.string().optional(),
  estimatedHours: z.coerce.number().optional(),
});

type TaskForm = z.infer<typeof schema>;

const inputStyle = {
  border: '1px solid #E5E7EB',
  backgroundColor: '#FFFFFF',
  color: '#111827',
  borderRadius: '12px',
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>{label}</label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  );
}

export default function NewTaskPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskForm>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'MEDIUM', status: 'PENDING' },
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-select'],
    queryFn: () => apiClient.get('/clients', { params: { limit: 100 } }).then(r => r.data),
  });

  const { data: staffData } = useQuery({
    queryKey: ['staff-select'],
    queryFn: () => apiClient.get('/users', { params: { limit: 100 } }).then(r => r.data),
  });

  const clients = clientsData?.data ?? [];
  const staff = staffData?.data ?? [];

  const onSubmit = async (data: TaskForm) => {
    try {
      const payload: any = { ...data };
      if (!payload.clientId) delete payload.clientId;
      if (!payload.assigneeId) delete payload.assigneeId;
      if (!payload.dueDate) delete payload.dueDate;
      if (!payload.estimatedHours) delete payload.estimatedHours;

      const res = await apiClient.post('/tasks', payload);
      toast.success('Task created successfully');
      router.push(`/tasks/${res.data.data?.id ?? ''}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    }
  };

  const focusBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#111827');
  const blurBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#E5E7EB');

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/tasks')}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: '#E5E7EB' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          <ArrowLeft size={14} />
        </button>
        <div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Tasks / New</p>
          <h1 className="text-lg font-bold" style={{ color: '#111827' }}>Create Task</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: '#E5E7EB' }}>
        <Field label="Title *" error={errors.title?.message}>
          <input {...register('title')} placeholder="e.g. Prepare ITR for FY 2024-25"
            className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </Field>

        <Field label="Description" error={errors.description?.message}>
          <textarea {...register('description')} rows={3} placeholder="Optional task details..."
            className="w-full px-3.5 py-2.5 text-sm outline-none transition-all resize-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Priority" error={errors.priority?.message}>
            <select {...register('priority')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </Field>

          <Field label="Status" error={errors.status?.message}>
            <select {...register('status')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Due Date">
            <input {...register('dueDate')} type="date"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>

          <Field label="Estimated Hours">
            <input {...register('estimatedHours')} type="number" min="0" step="0.5" placeholder="e.g. 2.5"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <Field label="Client">
          <select {...register('clientId')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
            <option value="">— Select client —</option>
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
          </select>
        </Field>

        <Field label="Assign To">
          <select {...register('assigneeId')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
            <option value="">— Unassigned —</option>
            {staff.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
          </select>
        </Field>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/tasks')}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Create Task</Button>
        </div>
      </form>
    </div>
  );
}
