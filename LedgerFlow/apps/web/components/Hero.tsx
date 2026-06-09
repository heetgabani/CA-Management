'use client';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Users, CheckSquare, Shield, FileText, Clock } from 'lucide-react';

const stats = [
  { label: 'Total Clients', value: '58', icon: Users },
  { label: 'Active Tasks', value: '150', icon: CheckSquare },
  { label: 'Compliance', value: '100', icon: Shield },
  { label: 'Documents', value: '500', icon: FileText },
];

const activity = [
  { text: 'ITR Filed — Aman Verma', time: '2m ago' },
  { text: 'Doc Uploaded — Shulaabh Packaging', time: '15m ago' },
  { text: 'GST Due — Sunrise Trading', time: '1h ago' },
];

const compliance = [
  { label: 'GSTR-3B — Shulaabh Packaging', days: 10, pct: 80 },
  { label: 'DSC Renewal — Shulaabh', days: 25, pct: 50 },
  { label: 'Audit — Sunrise Trading', days: 30, pct: 40 },
];

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-lg">
        {/* Title bar */}
        <div className="bg-[#F1F5F9] px-4 py-3 flex items-center gap-3 border-b border-[#E2E8F0]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
            <div className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
            <div className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
          </div>
          <div className="flex-1 max-w-xs mx-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-md px-3 py-1 text-xs text-[#64748B] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              app.ledgerflow.in/dashboard
            </div>
          </div>
        </div>

        {/* App UI */}
        <div className="bg-[#F6F8FA] flex h-80">
          {/* Sidebar */}
          <div className="w-14 bg-white border-r border-[#E2E8F0] flex flex-col items-center py-4 gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center mb-2">
              <span className="text-white text-xs font-black">LF</span>
            </div>
            {[Users, CheckSquare, Shield, FileText].map((Icon, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-[#F1F5F9]' : ''}`}>
                <Icon size={14} className={i === 0 ? 'text-[#1F2937]' : 'text-[#94A3B8]'} />
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#64748B] text-xs">Good morning</p>
                <p className="text-[#1F2937] text-sm font-semibold">Gabani & Associates</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center">
                <span className="text-white text-xs font-bold">H</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="bg-white rounded-xl p-2.5 border border-[#E2E8F0]"
                >
                  <s.icon size={11} className="text-[#64748B]" />
                  <p className="text-[#1F2937] font-bold text-base mt-1">{s.value}</p>
                  <p className="text-[#94A3B8] text-xs">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-2">
              {/* Activity */}
              <div className="bg-white rounded-xl p-2.5 border border-[#E2E8F0]">
                <p className="text-[#64748B] text-xs font-medium mb-2">Recent Activity</p>
                <div className="space-y-1.5">
                  {activity.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.08 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                      <p className="text-[#64748B] text-xs truncate flex-1">{a.text}</p>
                      <p className="text-[#94A3B8] text-xs shrink-0">{a.time}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-white rounded-xl p-2.5 border border-[#E2E8F0]">
                <p className="text-[#64748B] text-xs font-medium mb-2">Upcoming Deadlines</p>
                <div className="space-y-1.5">
                  {compliance.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.08 }}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[#64748B] text-xs truncate">{c.label}</p>
                        <span className="text-[#F59E0B] text-xs shrink-0 ml-1 font-medium">{c.days}d</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-1">
                        <div className="bg-[#4F46E5] h-1 rounded-full" style={{ width: `${c.pct}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification cards */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-14 top-16 bg-white rounded-2xl p-3 shadow-md border border-[#E2E8F0] hidden lg:block"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
            <CheckCircle2 size={15} className="text-[#10B981]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1F2937]">ITR Filed</p>
            <p className="text-xs text-[#64748B]">Aman Verma · just now</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -right-14 bottom-20 bg-white rounded-2xl p-3 shadow-md border border-[#E2E8F0] hidden lg:block"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#FFFBEB] rounded-xl flex items-center justify-center">
            <Clock size={15} className="text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1F2937]">Due in 10 days</p>
            <p className="text-xs text-[#64748B]">GSTR-3B · May 2025</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F6F8FA] overflow-hidden flex flex-col">
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E2E8F0]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col lg:flex-row items-center gap-16 flex-1">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs text-[#64748B] font-medium mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            The Digital OS For Professional Firms
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] leading-[1.08] tracking-tight"
          >
            Run Your Entire{' '}
            <span className="underline decoration-[#E2E8F0] decoration-4 underline-offset-4">Professional Firm</span>
            <br />From One Platform
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-xl"
          >
            Manage clients, documents, compliance, staff, tasks, and physical records from a centralized workspace built for Chartered Accountants, Company Secretaries, and professional service firms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <a
              href="http://localhost:3000/register"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#4F46E5] text-white rounded-xl hover:bg-[#4338CA] transition-colors"
            >
              Start Free Trial
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="http://localhost:3000/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-white border border-[#E2E8F0] text-[#1F2937] rounded-xl hover:bg-[#F9FAFB] transition-colors"
            >
              Book Live Demo
            </a>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-5 flex flex-wrap items-center gap-4 justify-center lg:justify-start"
          >
            {['No Credit Card Required', 'Free 14-Day Trial', 'Cancel Anytime'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <CheckCircle2 size={11} className="text-[#10B981]" />
                {t}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 w-full max-w-2xl"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
