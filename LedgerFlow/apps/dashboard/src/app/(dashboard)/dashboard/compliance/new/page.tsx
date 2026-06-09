'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/shared/Button';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FILED', 'OVERDUE']),
  dueDate: z.string().min(1, 'Due date is required'),
  clientId: z.string().min(1, 'Client is required'),
  assigneeId: z.string().optional(),
  period: z.string().optional(),
  financialYear: z.string().optional(),
});

type ComplianceForm = z.infer<typeof schema>;

const COMPLIANCE_TYPES = ['GST_RETURN', 'ITR', 'TDS_RETURN', 'ROC_FILING', 'AUDIT', 'ADVANCE_TAX', 'PF_ESI', 'OTHER'];

const inputStyle = { border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#1F2937', borderRadius: '12px' };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>{label}</label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  );
}

export default function NewCompliancePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ComplianceForm>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'PENDING' },
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

  const focusBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#4F46E5');
  const blurBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#E2E8F0');

  const onSubmit = async (data: ComplianceForm) => {
    try {
      const payload: any = { ...data };
      if (!payload.assigneeId) delete payload.assigneeId;
      if (!payload.period) delete payload.period;
      if (!payload.financialYear) delete payload.financialYear;

      const res = await apiClient.post('/compliance', payload);
      toast.success('Compliance record created');
      router.push(`/compliance/${res.data.data?.id ?? ''}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create compliance record');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/dashboard/compliance')}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: '#E2E8F0' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          <ArrowLeft size={14} />
        </button>
        <div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Compliance / New</p>
          <h1 className="text-lg font-bold" style={{ color: '#1F2937' }}>Add Compliance</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: '#E2E8F0' }}>
        <Field label="Title *" error={errors.title?.message}>
          <input {...register('title')} placeholder="e.g. GST Return — July 2025"
            className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type *" error={errors.type?.message}>
            <select {...register('type')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">— Select type —</option>
              {COMPLIANCE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>

          <Field label="Status">
            <select {...register('status')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FILED">Filed</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </Field>
        </div>

        <Field label="Client *" error={errors.clientId?.message}>
          <select {...register('clientId')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
            <option value="">— Select client —</option>
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Due Date *" error={errors.dueDate?.message}>
            <input {...register('dueDate')} type="date"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>

          <Field label="Assign To">
            <select {...register('assigneeId')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">— Unassigned —</option>
              {staff.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Period">
            <input {...register('period')} placeholder="e.g. Q2 2025"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>

          <Field label="Financial Year">
            <input {...register('financialYear')} placeholder="e.g. 2024-25"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <Field label="Description">
          <textarea {...register('description')} rows={3} placeholder="Optional notes..."
            className="w-full px-3.5 py-2.5 text-sm outline-none transition-all resize-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </Field>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/dashboard/compliance')}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Add Compliance</Button>
        </div>
      </form>
    </div>
  );
}
