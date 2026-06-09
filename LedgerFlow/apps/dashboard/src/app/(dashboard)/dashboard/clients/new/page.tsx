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
  displayName: z.string().min(1, 'Display name is required'),
  clientType: z.enum(['INDIVIDUAL', 'HUF', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'TRUST', 'SOCIETY', 'AOP', 'BOI', 'OTHER']),
  businessName: z.string().optional(),
  tradeName: z.string().optional(),
  primaryMobile: z.string().optional(),
  alternateMobile: z.string().optional(),
  primaryEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  alternateEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  pan: z.string().optional(),
  gstin: z.string().optional(),
  tan: z.string().optional(),
  cin: z.string().optional(),
  aadhaar: z.string().optional(),
  assignedPartnerId: z.string().optional(),
  assignedAccountantId: z.string().optional(),
  leadSource: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT']),
});

type ClientForm = z.infer<typeof schema>;

const CLIENT_TYPES = ['INDIVIDUAL', 'HUF', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'TRUST', 'SOCIETY', 'AOP', 'BOI', 'OTHER'];
const LEAD_SOURCES = ['REFERRAL', 'WALK_IN', 'WEBSITE', 'SOCIAL_MEDIA', 'ADVERTISEMENT', 'OTHER'];

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

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-xs font-semibold uppercase tracking-wide pt-2" style={{ color: '#64748B' }}>{title}</h3>;
}

export default function NewClientPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClientForm>({
    resolver: zodResolver(schema),
    defaultValues: { clientType: 'INDIVIDUAL', status: 'ACTIVE' },
  });

  const { data: staffData } = useQuery({
    queryKey: ['staff-select'],
    queryFn: () => apiClient.get('/users', { params: { limit: 100 } }).then(r => r.data),
  });
  const staff = staffData?.data ?? [];

  const focusBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#4F46E5');
  const blurBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#E2E8F0');

  const onSubmit = async (data: ClientForm) => {
    try {
      const payload: any = { ...data };
      ['businessName', 'tradeName', 'primaryMobile', 'alternateMobile', 'primaryEmail', 'alternateEmail',
       'pan', 'gstin', 'tan', 'cin', 'aadhaar', 'assignedPartnerId', 'assignedAccountantId', 'leadSource']
        .forEach(k => { if (!payload[k]) delete payload[k]; });

      const res = await apiClient.post('/clients', payload);
      toast.success('Client created successfully');
      router.push(`/clients/${res.data.data?.id ?? ''}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create client');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/dashboard/clients')}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: '#E2E8F0' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          <ArrowLeft size={14} />
        </button>
        <div>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Clients / New</p>
          <h1 className="text-lg font-bold" style={{ color: '#1F2937' }}>Add Client</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: '#E2E8F0' }}>
        <SectionTitle title="Basic Details" />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Display Name *" error={errors.displayName?.message}>
            <input {...register('displayName')} placeholder="Full name or firm name"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>

          <Field label="Client Type *" error={errors.clientType?.message}>
            <select {...register('clientType')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              {CLIENT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Business Name">
            <input {...register('businessName')} placeholder="Legal business name"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
          <Field label="Trade Name">
            <input {...register('tradeName')} placeholder="Trade / brand name"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <SectionTitle title="Contact Details" />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Mobile">
            <input {...register('primaryMobile')} placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
          <Field label="Alternate Mobile">
            <input {...register('alternateMobile')} placeholder="+91 98765 43211"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Email" error={errors.primaryEmail?.message}>
            <input {...register('primaryEmail')} type="email" placeholder="client@example.com"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
          <Field label="Alternate Email" error={errors.alternateEmail?.message}>
            <input {...register('alternateEmail')} type="email" placeholder="other@example.com"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <SectionTitle title="Tax Identifiers" />

        <div className="grid grid-cols-2 gap-4">
          <Field label="PAN">
            <input {...register('pan')} placeholder="ABCDE1234F" maxLength={10}
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all font-mono uppercase"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
          <Field label="Aadhaar">
            <input {...register('aadhaar')} placeholder="1234 5678 9012" maxLength={12}
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="GSTIN">
            <input {...register('gstin')} placeholder="27ABCDE1234F1Z5" maxLength={15}
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all font-mono uppercase"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
          <Field label="TAN">
            <input {...register('tan')} placeholder="ABCD12345E"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all font-mono uppercase"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="CIN">
            <input {...register('cin')} placeholder="U74999MH2020PTC123456"
              className="w-full px-3.5 py-2.5 text-sm outline-none transition-all font-mono uppercase"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        <SectionTitle title="Assignment" />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Assigned Partner">
            <select {...register('assignedPartnerId')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">— None —</option>
              {staff.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
          </Field>
          <Field label="Assigned Accountant">
            <select {...register('assignedAccountantId')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">— None —</option>
              {staff.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Lead Source">
            <select {...register('leadSource')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">— Select —</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select {...register('status')} className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PROSPECT">Prospect</option>
            </select>
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/dashboard/clients')}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Add Client</Button>
        </div>
      </form>
    </div>
  );
}
