'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, CheckSquare, Shield, AlertTriangle, FileText,
  HardDrive, TrendingUp, Clock, Plus, Upload, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { StatCard } from '@/components/shared/StatCard';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function QuickAction({ icon: Icon, label, href, color }: { icon: any; label: string; href: string; color: string }) {
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer"
        style={{ borderColor: '#E5E7EB' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="text-sm font-medium" style={{ color: '#374151' }}>{label}</span>
        <ChevronRight size={13} style={{ color: '#D1D5DB', marginLeft: 'auto' }} />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router   = useRouter();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get('/dashboard/stats').then(r => r.data.data),
    staleTime: 60_000,
  });

  const { data: compliance } = useQuery({
    queryKey: ['compliance-overview'],
    queryFn: () => apiClient.get('/dashboard/compliance-overview').then(r => r.data.data),
    staleTime: 60_000,
  });

  const statCards = [
    { title: 'Total Clients',    value: stats?.totalClients    ?? '—', icon: Users,       iconBg: '#DBEAFE', iconColor: '#1D4ED8', href: '/clients' },
    { title: 'Pending Tasks',    value: stats?.pendingTasks    ?? '—', icon: CheckSquare, iconBg: '#FEF9C3', iconColor: '#A16207', href: '/tasks' },
    { title: 'Due This Week',    value: stats?.dueSoonCompliances ?? '—', icon: Shield,   iconBg: '#FEE2E2', iconColor: '#B91C1C', href: '/compliance' },
    { title: 'Overdue Tasks',    value: stats?.overdueTasks    ?? '—', icon: AlertTriangle, iconBg: '#FFEDD5', iconColor: '#C2410C', href: '/tasks?status=overdue' },
    { title: 'Total Documents',  value: stats?.totalDocuments  ?? '—', icon: FileText,    iconBg: '#DCFCE7', iconColor: '#15803D', href: '/clients' },
    { title: 'Storage Used',     value: stats?.storageUsedMB != null ? `${stats.storageUsedMB} MB` : '—', icon: HardDrive, iconBg: '#F3E8FF', iconColor: '#7E22CE', href: '/settings' },
  ];

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: '#111827' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName || 'there'} 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
      >
        {statCards.map((card) => (
          <motion.div key={card.title} variants={item}>
            <Link href={card.href} className="block">
              <StatCard
                title={card.title}
                value={statsLoading ? '…' : card.value}
                icon={card.icon}
                iconBg={card.iconBg}
                iconColor={card.iconColor}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-12 gap-5">
        {/* Compliance due soon */}
        <div className="col-span-8">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Compliance Deadlines</h3>
              <Link href="/compliance" className="text-xs font-medium hover:underline" style={{ color: '#6B7280' }}>View all</Link>
            </div>
            {compliance?.dueSoon?.length ? (
              <div className="space-y-2">
                {compliance.dueSoon.slice(0, 6).map((c: any) => {
                  const due  = new Date(c.dueDate);
                  const diff = Math.ceil((due.getTime() - Date.now()) / 86400000);
                  return (
                    <Link key={c.id} href={`/compliance/${c.id}`}>
                      <div
                        className="flex items-center gap-3 p-3 rounded-xl transition-all"
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2' }}>
                          <Shield size={13} style={{ color: '#B91C1C' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>{c.title}</p>
                          <p className="text-xs" style={{ color: '#9CA3AF' }}>{c.client?.displayName} · {c.type}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <Badge variant={diff <= 3 ? 'danger' : 'warning'} label={diff === 0 ? 'Today' : `${diff}d left`} />
                          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                            {due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : compliance?.overdue?.length ? (
              <div className="space-y-2">
                {compliance.overdue.slice(0, 6).map((c: any) => (
                  <Link key={c.id} href={`/compliance/${c.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F9FAFB] transition-all">
                      <Shield size={14} style={{ color: '#DC2626' }} />
                      <p className="flex-1 text-sm" style={{ color: '#374151' }}>{c.title}</p>
                      <Badge variant="danger" label="Overdue" dot />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-6 justify-center">
                <Shield size={20} style={{ color: '#D1D5DB' }} />
                <p className="text-sm" style={{ color: '#9CA3AF' }}>No compliance deadlines this week</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Quick Actions</h3>
            <div className="space-y-1.5">
              <QuickAction icon={Users}       label="Add Client"         href="/clients/new"          color="#1D4ED8" />
              <QuickAction icon={CheckSquare} label="Create Task"        href="/tasks?new=1"          color="#A16207" />
              <QuickAction icon={Shield}      label="Add Compliance"     href="/compliance/new"       color="#B91C1C" />
              <QuickAction icon={Upload}      label="Upload Document"    href="/clients"              color="#15803D" />
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>Recent Activity</h3>
            {stats?.recentActivities?.length ? (
              <div className="space-y-3">
                {stats.recentActivities.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp size={10} style={{ color: '#6B7280' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed truncate" style={{ color: '#374151' }}>{a.description}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                        {new Date(a.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-center py-4" style={{ color: '#9CA3AF' }}>No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
