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
  fileNumber: z.string().min(1, 'File number is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  clientId: z.string().min(1, 'Client is required'),
  financialYear: z.string().optional(),
});

type PhysicalFileForm = z.infer<typeof schema>;

const CATEGORIES = ['ITR', 'GST', 'ACCOUNTS', 'AUDIT', 'LEGAL', 'TDS', 'ROC', 'OTHER'];

const inputStyle = { border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#111827', borderRadius: '12px' };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>{label}</label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  );
}

export default function NewPhysicalFilePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PhysicalFileForm>({
    resolver: zodResolver(schema),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-select'],
    queryFn: () => apiClient.get('/clients', { params: { limit: 100 } }).then(r => r.data),
  });

  const clients = clientsData?.data ?? [];

  const focusBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#111827');
  const blurBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#E5E7EB');

  const onSubmit = async (data: PhysicalFileForm) => {
    try {
      const payload: any = { ...data };
      if (!payload.financialYear) delete payload.financialYear;
      if (!payload.description) delete payload.description;

      const res = await apiClient.post('/physical-files', payload);
      toast.success('Physical file registered');
      router.push(`/physical-files/${res.data.data?.id ?? ''}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to register file');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/physical-files')}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: '#E5E7EB' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          <ArrowLeft size={14} />
        </button>
        <div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Physical Files / New</p>
          <h1 className="text-lg font-bold" style={{ color: '#111827' }}>Register File</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: '#E5E7EB' }}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="File Number *" error={errors.fileNumber?.message}>
            <input {...register('fileNumber')} placeholder="e.g. FILE-2025-001"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>

          <Field label="Category *" error={errors.category?.message}>
            <select {...register('category')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">— Select category —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Title *" error={errors.title?.message}>
          <input {...register('title')} placeholder="e.g. Rahul Sharma — ITR FY 2024-25"
            className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </Field>

        <Field label="Client *" error={errors.clientId?.message}>
          <select {...register('clientId')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
            <option value="">— Select client —</option>
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.displayName}</option>)}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Storage Location *" error={errors.location?.message}>
            <input {...register('location')} placeholder="e.g. Cabinet A, Shelf 2"
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
          <textarea {...register('description')} rows={3} placeholder="Optional notes about file contents..."
            className="w-full px-3.5 py-2.5 text-sm outline-none transition-all resize-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </Field>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/physical-files')}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Register File</Button>
        </div>
      </form>
    </div>
  );
}
