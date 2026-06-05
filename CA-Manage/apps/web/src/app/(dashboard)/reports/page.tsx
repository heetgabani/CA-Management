'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, BarChart3, Users, CheckSquare, Shield, HardDrive, FileText } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { StatCard } from '@/components/shared/StatCard';
import { toast } from 'sonner';

const REPORTS = [
  { key: 'clients',     label: 'Client Report',       icon: Users,       desc: 'Client list with status and details' },
  { key: 'tasks',       label: 'Task Report',          icon: CheckSquare, desc: 'Task completion and productivity' },
  { key: 'compliance',  label: 'Compliance Report',    icon: Shield,      desc: 'Compliance deadlines and filings' },
  { key: 'storage',     label: 'Storage Usage',        icon: HardDrive,   desc: 'Document storage by client and type' },
  { key: 'documents',   label: 'Document Statistics',  icon: FileText,    desc: 'Upload and access activity' },
  { key: 'staff',       label: 'Staff Productivity',   icon: Users,       desc: 'Tasks and activities by staff member' },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get('/dashboard/stats').then(r => r.data.data),
    staleTime: 60_000,
  });

  const downloadReport = async (key: string, format: 'csv' | 'excel') => {
    setGenerating(`${key}-${format}`);
    try {
      const res = await apiClient.get(`/reports/${key}`, { params: { format }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a   = document.createElement('a');
      a.href    = url;
      a.download = `${key}-report.${format === 'csv' ? 'csv' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${key} report downloaded`);
    } catch {
      toast.error('Report generation failed. Try again.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and export firm reports" />

      {/* Quick stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Clients"    value={stats.totalClients    ?? 0} icon={Users}       iconBg="#DBEAFE" iconColor="#1D4ED8" />
          <StatCard title="Pending Tasks"    value={stats.pendingTasks    ?? 0} icon={CheckSquare} iconBg="#FEF9C3" iconColor="#A16207" />
          <StatCard title="Compliance Due"   value={stats.dueSoonCompliances ?? 0} icon={Shield}   iconBg="#FEE2E2" iconColor="#B91C1C" />
          <StatCard title="Documents"        value={stats.totalDocuments  ?? 0} icon={FileText}    iconBg="#DCFCE7" iconColor="#15803D" />
        </div>
      )}

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(({ key, label, icon: Icon, desc }) => (
          <div key={key} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <Icon size={18} style={{ color: '#374151' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#111827' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{desc}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={12} />}
                loading={generating === `${key}-csv`}
                onClick={() => downloadReport(key, 'csv')}
                className="flex-1"
              >
                CSV
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download size={12} />}
                loading={generating === `${key}-excel`}
                onClick={() => downloadReport(key, 'excel')}
                className="flex-1"
              >
                Excel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
