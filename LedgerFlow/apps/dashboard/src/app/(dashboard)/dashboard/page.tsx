'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, CheckSquare, Shield, AlertTriangle, FileText,
  HardDrive, TrendingUp, Upload, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { StatCard } from '@/components/shared/StatCard';
import { Badge } from '@/components/shared/Badge';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function QuickAction({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer hover:bg-[#F1F5F9]"
      >
        <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
          <Icon size={15} className="text-[#1F2937]" />
        </div>
        <span className="text-sm font-medium text-[#1F2937]">{label}</span>
        <ChevronRight size={13} className="text-[#CBD5E1] ml-auto" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

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
    { title: 'Total Clients',    value: stats?.totalClients    ?? '—', icon: Users,         href: '/dashboard/clients' },
    { title: 'Pending Tasks',    value: stats?.pendingTasks    ?? '—', icon: CheckSquare,   href: '/dashboard/tasks' },
    { title: 'Due This Week',    value: stats?.dueSoonCompliances ?? '—', icon: Shield,     href: '/dashboard/compliance' },
    { title: 'Overdue Tasks',    value: stats?.overdueTasks    ?? '—', icon: AlertTriangle, href: '/dashboard/tasks?status=overdue' },
    { title: 'Total Documents',  value: stats?.totalDocuments  ?? '—', icon: FileText,      href: '/dashboard/clients' },
    { title: 'Storage Used',     value: stats?.storageUsedMB != null ? `${stats.storageUsedMB} MB` : '—', icon: HardDrive, href: '/dashboard/settings' },
  ];

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: '#1F2937' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName || 'there'} 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
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
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-12 gap-5">
        {/* Compliance due soon */}
        <div className="col-span-8">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: '#1F2937' }}>Compliance Deadlines</h3>
              <Link href="/dashboard/compliance" className="text-xs font-medium hover:underline" style={{ color: '#64748B' }}>View all</Link>
            </div>
            {compliance?.dueSoon?.length ? (
              <div className="space-y-2">
                {compliance.dueSoon.slice(0, 6).map((c: any) => {
                  const due  = new Date(c.dueDate);
                  const diff = Math.ceil((due.getTime() - Date.now()) / 86400000);
                  return (
                    <Link key={c.id} href={`/dashboard/compliance/${c.id}`}>
                      <div
                        className="flex items-center gap-3 p-3 rounded-xl transition-all"
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF2F2' }}>
                          <Shield size={13} style={{ color: '#EF4444' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#1F2937' }}>{c.title}</p>
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
                  <Link key={c.id} href={`/dashboard/compliance/${c.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F1F5F9] transition-all">
                      <Shield size={14} style={{ color: '#EF4444' }} />
                      <p className="flex-1 text-sm" style={{ color: '#1F2937' }}>{c.title}</p>
                      <Badge variant="danger" label="Overdue" dot />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-6 justify-center">
                <Shield size={20} style={{ color: '#CBD5E1' }} />
                <p className="text-sm" style={{ color: '#9CA3AF' }}>No compliance deadlines this week</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2937' }}>Quick Actions</h3>
            <div className="space-y-1.5">
              <QuickAction icon={Users}       label="Add Client"      href="/dashboard/clients/new"    />
              <QuickAction icon={CheckSquare} label="Create Task"      href="/dashboard/tasks?new=1"    />
              <QuickAction icon={Shield}      label="Add Compliance"   href="/dashboard/compliance/new" />
              <QuickAction icon={Upload}      label="Upload Document"  href="/dashboard/clients"        />
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2937' }}>Recent Activity</h3>
            {stats?.recentActivities?.length ? (
              <div className="space-y-3">
                {stats.recentActivities.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp size={10} style={{ color: '#64748B' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed truncate" style={{ color: '#1F2937' }}>{a.description}</p>
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
