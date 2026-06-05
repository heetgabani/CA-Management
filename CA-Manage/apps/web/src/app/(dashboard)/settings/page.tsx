'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Building2, GitBranch, Users, Shield, Bell, Lock, Save } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Tabs } from '@/components/shared/Tabs';
import { toast } from 'sonner';

const TABS = [
  { key: 'firm',         label: 'Firm Profile',  icon: <Building2 size={13} /> },
  { key: 'branches',     label: 'Branches',       icon: <GitBranch size={13} /> },
  { key: 'roles',        label: 'Roles',          icon: <Shield size={13} /> },
  { key: 'notifications',label: 'Notifications',  icon: <Bell size={13} /> },
  { key: 'security',     label: 'Security',       icon: <Lock size={13} /> },
];

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-start py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <label className="text-sm font-medium pt-2" style={{ color: '#374151' }}>{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

function TextInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-9 px-3 text-sm rounded-xl border outline-none transition-all"
      style={{ borderColor: '#E5E7EB', color: '#111827' }}
      onFocus={e => (e.target.style.borderColor = '#111827')}
      onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
    />
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState('firm');
  const qc = useQueryClient();

  const { data: firm, isLoading } = useQuery({
    queryKey: ['firm'],
    queryFn: () => apiClient.get('/firm').then(r => r.data.data),
  });

  const { register, handleSubmit, formState: { isDirty } } = useForm({
    values: firm ? {
      name: firm.name ?? '',
      email: firm.email ?? '',
      phone: firm.phone ?? '',
      gstNumber: firm.gstNumber ?? '',
      pan: firm.pan ?? '',
      website: firm.website ?? '',
      addressLine1: firm.addresses?.[0]?.line1 ?? '',
      city: firm.addresses?.[0]?.city ?? '',
      state: firm.addresses?.[0]?.state ?? '',
      pincode: firm.addresses?.[0]?.pincode ?? '',
    } : undefined,
  });

  const updateFirm = useMutation({
    mutationFn: (data: any) => apiClient.patch('/firm', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['firm'] }); toast.success('Firm profile saved'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  return (
    <div className="max-w-4xl">
      <PageHeader title="Settings" subtitle="Manage your firm and account settings" />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'firm' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>Firm Profile</h3>
            <p className="text-xs mb-6" style={{ color: '#6B7280' }}>Update your firm's basic information</p>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-5 h-5 rounded-full border-2 border-[#111827] border-t-transparent" />
              </div>
            ) : (
              <form onSubmit={handleSubmit(d => updateFirm.mutate(d))}>
                <FieldRow label="Firm Name">
                  <TextInput {...register('name')} placeholder="Sharma & Associates" />
                </FieldRow>
                <FieldRow label="Email">
                  <TextInput {...register('email')} type="email" placeholder="info@yourfirm.com" />
                </FieldRow>
                <FieldRow label="Phone">
                  <TextInput {...register('phone')} placeholder="+91 98765 43210" />
                </FieldRow>
                <FieldRow label="GST Number">
                  <TextInput {...register('gstNumber')} placeholder="27AABCS1429B1ZB" />
                </FieldRow>
                <FieldRow label="PAN">
                  <TextInput {...register('pan')} placeholder="AABCS1429B" />
                </FieldRow>
                <FieldRow label="Website">
                  <TextInput {...register('website')} type="url" placeholder="https://yourfirm.com" />
                </FieldRow>
                <FieldRow label="Address Line 1">
                  <TextInput {...register('addressLine1')} placeholder="123 Main Street" />
                </FieldRow>
                <div className="grid grid-cols-3 gap-4 items-start py-4">
                  <label className="text-sm font-medium pt-2" style={{ color: '#374151' }}>City / State / PIN</label>
                  <div className="col-span-2 grid grid-cols-3 gap-2">
                    <TextInput {...register('city')} placeholder="Mumbai" />
                    <TextInput {...register('state')} placeholder="Maharashtra" />
                    <TextInput {...register('pincode')} placeholder="400001" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" loading={updateFirm.isPending} icon={<Save size={13} />} disabled={!isDirty}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {tab === 'branches' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Branches</h3>
              <Button size="sm">Add Branch</Button>
            </div>
            <p className="text-sm py-8 text-center" style={{ color: '#9CA3AF' }}>Branch management coming soon</p>
          </div>
        )}

        {tab === 'roles' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Role Permissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <th className="text-left py-2 px-3 font-medium" style={{ color: '#6B7280' }}>Permission</th>
                    {['Owner', 'Partner', 'Manager', 'Accountant', 'Executive', 'Intern'].map(r => (
                      <th key={r} className="text-center py-2 px-3 font-medium" style={{ color: '#6B7280' }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['View Clients',     true,  true,  true,  true,  true,  false],
                    ['Create Clients',   true,  true,  true,  false, false, false],
                    ['Delete Clients',   true,  true,  false, false, false, false],
                    ['View Tasks',       true,  true,  true,  true,  true,  true ],
                    ['Manage Tasks',     true,  true,  true,  true,  false, false],
                    ['View Compliance',  true,  true,  true,  true,  true,  false],
                    ['Manage Compliance',true,  true,  true,  false, false, false],
                    ['Manage Staff',     true,  false, false, false, false, false],
                    ['View Reports',     true,  true,  true,  false, false, false],
                    ['View Audit Logs',  true,  true,  false, false, false, false],
                  ].map(([perm, ...vals]) => (
                    <tr key={String(perm)} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td className="py-2.5 px-3 font-medium" style={{ color: '#374151' }}>{perm}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="py-2.5 px-3 text-center">
                          <span style={{ color: v ? '#16A34A' : '#D1D5DB' }}>{v ? '✓' : '—'}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Notification Preferences</h3>
            {[
              { label: 'Task assigned to me',        key: 'taskAssigned' },
              { label: 'Compliance due in 7 days',    key: 'complianceDue' },
              { label: 'Document uploaded by client', key: 'documentUploaded' },
              { label: 'New staff joined',            key: 'staffJoined' },
              { label: 'System alerts',               key: 'systemAlerts' },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <span className="text-sm" style={{ color: '#374151' }}>{label}</span>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 rounded-full peer-checked:bg-[#111827] bg-[#E5E7EB] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        )}

        {tab === 'security' && (
          <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Security Settings</h3>
            <div className="py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>Two-Factor Authentication</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Add an extra layer of security</p>
                </div>
                <Button variant="secondary" size="sm">Enable 2FA</Button>
              </div>
            </div>
            <div className="py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>Change Password</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Update your account password</p>
                </div>
                <Button variant="secondary" size="sm">Change</Button>
              </div>
            </div>
            <div className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>Active Sessions</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>View and revoke active login sessions</p>
                </div>
                <Button variant="secondary" size="sm">View Sessions</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
