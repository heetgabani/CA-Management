'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Shield, CheckSquare, Archive, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'dashboard',   label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'clients',     label: 'Clients',          icon: Users },
  { id: 'documents',   label: 'Documents',        icon: FileText },
  { id: 'compliance',  label: 'Compliance',       icon: Shield },
  { id: 'tasks',       label: 'Tasks',            icon: CheckSquare },
  { id: 'files',       label: 'Physical Files',   icon: Archive },
  { id: 'audit',       label: 'Audit Logs',       icon: ClipboardList },
];

const screens: Record<string, React.ReactNode> = {
  dashboard:  <DashboardScreen />,
  clients:    <ClientsScreen />,
  documents:  <DocumentsScreen />,
  compliance: <ComplianceScreen />,
  tasks:      <TasksScreen />,
  files:      <FilesScreen />,
  audit:      <AuditScreen />,
};

function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F6F8FA] rounded-xl overflow-hidden border border-[#E2E8F0] p-4 h-80">
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Active':      'bg-[#ECFDF5] text-[#10B981]',
    'Completed':   'bg-[#ECFDF5] text-[#10B981]',
    'Filed':       'bg-[#ECFDF5] text-[#10B981]',
    'Pending':     'bg-[#FFFBEB] text-[#F59E0B]',
    'In Progress': 'bg-[#F1F5F9] text-[#64748B]',
    'Overdue':     'bg-[#FEF2F2] text-[#EF4444]',
    'Issued':      'bg-[#FFFBEB] text-[#F59E0B]',
    'In Office':   'bg-[#ECFDF5] text-[#10B981]',
  };
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium w-fit', map[status] ?? 'bg-[#F1F5F9] text-[#64748B]')}>
      {status}
    </span>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <div className={`grid gap-4 px-3 py-2 bg-[#F6F8FA] border-b border-[#E2E8F0]`} style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
      {cols.map(h => <p key={h} className="text-xs font-semibold text-[#94A3B8]">{h}</p>)}
    </div>
  );
}

function DashboardScreen() {
  return (
    <ScreenWrapper>
      <p className="text-sm font-bold text-[#1F2937] mb-3">Overview</p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[['58', 'Clients'], ['150', 'Tasks'], ['100', 'Compliance'], ['500', 'Docs']].map(([v, l]) => (
          <div key={l} className="bg-white rounded-xl p-3 border border-[#E2E8F0] text-center">
            <p className="text-xl font-extrabold text-[#1F2937]">{v}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">{l}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 border border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#64748B] mb-2">Recent Activity</p>
          {[['ITR Filed', 'Aman Verma', '2m'], ['GST Uploaded', 'Shulaabh Pkg', '1h'], ['Client Added', 'Modi Textiles', '2h']].map(([a, c, t]) => (
            <div key={a} className="flex justify-between items-center py-1 text-xs">
              <span className="text-[#64748B]">{a} — {c}</span>
              <span className="text-[#CBD5E1]">{t}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#E2E8F0]">
          <p className="text-xs font-semibold text-[#64748B] mb-2">Upcoming Deadlines</p>
          {[['GSTR-3B Due', '10d', '#EF4444'], ['DSC Renewal', '25d', '#F59E0B'], ['Audit Report', '30d', '#64748B']].map(([t, d, col]) => (
            <div key={t} className="flex justify-between items-center py-1 text-xs">
              <span className="text-[#64748B]">{t}</span>
              <span className="font-medium" style={{ color: col }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
}

function ClientsScreen() {
  return (
    <ScreenWrapper>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#1F2937]">All Clients <span className="text-[#94A3B8] font-normal ml-1">(58)</span></p>
        <button className="text-xs bg-[#4F46E5] text-white px-2.5 py-1 rounded-lg">+ Add Client</button>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <TableHeader cols={['Client', 'Type', 'Status', 'Assigned To']} />
        {[
          ['Aman Verma',          'Individual',     'Active', 'Amit Desai'],
          ['Shulaabh Packaging',  'Proprietorship', 'Active', 'Neha Mehta'],
          ['Sunrise Trading Co.', 'Partnership',    'Active', 'Rahul Joshi'],
          ['Modi Textiles',       'Proprietorship', 'Active', 'Karan Modi'],
          ['TechStar LLP',        'LLP',            'Active', 'Amit Desai'],
        ].map(([n, t, s, a]) => (
          <div key={n} className="grid grid-cols-4 gap-4 px-3 py-2.5 border-b border-[#F9FAFB] hover:bg-[#F6F8FA] transition-colors">
            <p className="text-xs font-medium text-[#1F2937] truncate">{n}</p>
            <p className="text-xs text-[#64748B]">{t}</p>
            <StatusBadge status={s} />
            <p className="text-xs text-[#94A3B8]">{a}</p>
          </div>
        ))}
      </div>
    </ScreenWrapper>
  );
}

function DocumentsScreen() {
  return (
    <ScreenWrapper>
      <p className="text-sm font-bold text-[#1F2937] mb-3">Document Locker — Aman Verma</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[['KYC', '2 files'], ['Income Tax', '2 files'], ['Bank Statements', '1 file']].map(([n, c]) => (
          <div key={n} className="bg-white border border-[#E2E8F0] rounded-xl p-3 cursor-pointer hover:border-[#CBD5E1] transition-colors">
            <p className="text-xs font-semibold text-[#1F2937]">{n}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">{c}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0]">
        {[['Aadhaar.pdf', 'KYC', '245 KB', 'Apr 2025'], ['PAN Card.pdf', 'KYC', '128 KB', 'Apr 2025'], ['Form16_2025.pdf', 'Income Tax', '512 KB', 'May 2025'], ['BankStatement.pdf', 'Bank', '1.2 MB', 'Mar 2025']].map(([n, c, s, d]) => (
          <div key={n} className="flex items-center gap-3 px-3 py-2 border-b border-[#F9FAFB] last:border-0">
            <div className="w-6 h-6 bg-[#FEF2F2] rounded flex items-center justify-center">
              <p className="text-[#EF4444] text-xs font-bold">PDF</p>
            </div>
            <p className="text-xs font-medium text-[#1F2937] flex-1">{n}</p>
            <p className="text-xs text-[#94A3B8]">{c}</p>
            <p className="text-xs text-[#CBD5E1]">{s}</p>
            <p className="text-xs text-[#CBD5E1]">{d}</p>
          </div>
        ))}
      </div>
    </ScreenWrapper>
  );
}

function ComplianceScreen() {
  return (
    <ScreenWrapper>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#1F2937]">Compliance Tracker</p>
        <div className="flex gap-1">
          {['All', 'Overdue', 'Pending', 'Filed'].map((f, i) => (
            <button key={f} className={`text-xs px-2 py-0.5 rounded-lg ${i === 0 ? 'bg-[#4F46E5] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <TableHeader cols={['Title', 'Client', 'Due Date', 'Status']} />
        {[
          ['GSTR-3B May 2025', 'Shulaabh Pkg',    'Jun 20, 2025', 'Pending'],
          ['DSC Renewal',      'Shulaabh Pkg',    'Jul 5, 2025',  'Pending'],
          ['ITR AY 2025-26',   'Aman Verma',      'Jul 31, 2025', 'Filed'],
          ['Audit FY2025',     'Sunrise Trading', 'Sep 30, 2025', 'In Progress'],
          ['ROC Annual',       'TechStar LLP',    'Nov 30, 2025', 'Pending'],
        ].map(([t, c, d, s]) => (
          <div key={t} className="grid grid-cols-4 gap-4 px-3 py-2.5 border-b border-[#F9FAFB] hover:bg-[#F6F8FA]">
            <p className="text-xs font-medium text-[#1F2937] truncate">{t}</p>
            <p className="text-xs text-[#64748B] truncate">{c}</p>
            <p className="text-xs text-[#64748B]">{d}</p>
            <StatusBadge status={s} />
          </div>
        ))}
      </div>
    </ScreenWrapper>
  );
}

function TasksScreen() {
  return (
    <ScreenWrapper>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#1F2937]">Tasks</p>
        <div className="flex gap-1 text-xs">
          <span className="px-2 py-0.5 bg-[#FFFBEB] text-[#F59E0B] rounded-lg">48 Pending</span>
          <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded-lg">32 In Progress</span>
          <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#10B981] rounded-lg">70 Done</span>
        </div>
      </div>
      <div className="space-y-2">
        {[
          ['Prepare ITR — Aman Verma',      'High',   'Completed',   'Amit Desai'],
          ['Collect Purchase Register',      'High',   'Pending',     'Neha Mehta'],
          ['Review GST Data',               'Medium', 'In Progress', 'Neha Mehta'],
          ['Audit Documentation',           'High',   'In Progress', 'Rahul Joshi'],
          ['Review Balance Sheet',          'High',   'Pending',     'Priya Shah'],
        ].map(([t, p, s, a]) => (
          <div key={t} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-[#E2E8F0]">
            <div className={`w-1.5 h-8 rounded-full ${p === 'High' ? 'bg-[#EF4444]' : p === 'Medium' ? 'bg-[#F59E0B]' : 'bg-[#CBD5E1]'}`} />
            <p className="text-xs font-medium text-[#1F2937] flex-1">{t}</p>
            <p className="text-xs text-[#94A3B8]">{a}</p>
            <StatusBadge status={s} />
          </div>
        ))}
      </div>
    </ScreenWrapper>
  );
}

function FilesScreen() {
  return (
    <ScreenWrapper>
      <p className="text-sm font-bold text-[#1F2937] mb-3">Physical File Register</p>
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <TableHeader cols={['File No.', 'Client', 'Location', 'Status', 'Last Movement']} />
        {[
          ['PF-001', 'Aman Verma',      'Cab 1, Shelf 2, A1', 'In Office', '3 months ago'],
          ['PF-002', 'Shulaabh Pkg',    'Cab 2, Shelf 1, B3', 'In Office', '2 months ago'],
          ['PF-003', 'Sunrise Trading', 'Cab 3, Shelf 4, C5', 'In Office', '1 month ago'],
          ['PF-004', 'Modi Textiles',   'Cab 1, Shelf 3, A5', 'Issued',    '5 days ago'],
          ['PF-005', 'TechStar LLP',    'Cab 4, Shelf 1, D2', 'In Office', '2 weeks ago'],
        ].map(([f, c, l, s, m]) => (
          <div key={f} className="grid grid-cols-5 gap-2 px-3 py-2.5 border-b border-[#F9FAFB] hover:bg-[#F6F8FA]">
            <p className="text-xs font-mono font-medium text-[#1F2937]">{f}</p>
            <p className="text-xs text-[#64748B] truncate">{c}</p>
            <p className="text-xs text-[#64748B] truncate">{l}</p>
            <StatusBadge status={s} />
            <p className="text-xs text-[#CBD5E1]">{m}</p>
          </div>
        ))}
      </div>
    </ScreenWrapper>
  );
}

function AuditScreen() {
  return (
    <ScreenWrapper>
      <p className="text-sm font-bold text-[#1F2937] mb-3">Audit Log</p>
      <div className="space-y-2">
        {[
          ['Heet Gabani',  'LOGIN',  'User authenticated',              '192.168.1.10', '2m ago'],
          ['Amit Desai',   'UPLOAD', 'Document uploaded — Form 16',     '192.168.1.15', '1h ago'],
          ['Neha Mehta',   'UPDATE', 'Compliance status updated',       '192.168.1.20', '2h ago'],
          ['Rahul Joshi',  'CREATE', 'Task created for Sunrise Trading', '192.168.1.15', '3h ago'],
          ['Priya Shah',   'UPDATE', 'Client profile updated',          '192.168.1.10', '5h ago'],
        ].map(([u, a, d, ip, t]) => (
          <div key={d} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-[#E2E8F0]">
            <div className="w-6 h-6 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-[#1F2937] text-xs font-bold">{u[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#1F2937]">
                {u} — <span className="font-mono text-[#64748B]">{a}</span>
              </p>
              <p className="text-xs text-[#94A3B8] truncate">{d}</p>
            </div>
            <p className="text-xs font-mono text-[#CBD5E1] shrink-0">{ip}</p>
            <p className="text-xs text-[#CBD5E1] shrink-0">{t}</p>
          </div>
        ))}
      </div>
    </ScreenWrapper>
  );
}

export default function Showcase() {
  const [active, setActive] = useState('dashboard');

  return (
    <section className="py-28 bg-[#F6F8FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold mb-4">
            Product Tour
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            See LedgerFlow In Action
          </h2>
          <p className="mt-3 text-[#64748B] max-w-xl mx-auto">
            Explore every module your firm needs in one unified platform.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                active === tab.id
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#1F2937]'
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Screen */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-2 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {screens[active]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
