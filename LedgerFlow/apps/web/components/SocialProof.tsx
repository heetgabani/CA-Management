'use client';
import { motion } from 'framer-motion';
import { Users, FileText, Shield, Building2, ClipboardList, Archive, Lock, Activity } from 'lucide-react';

const badges = [
  { icon: Users,        label: 'Client Management' },
  { icon: FileText,     label: 'Document Storage' },
  { icon: Shield,       label: 'Compliance Tracking' },
  { icon: Building2,    label: 'Staff Management' },
  { icon: ClipboardList,label: 'Audit Logs' },
  { icon: Archive,      label: 'Physical File Tracking' },
  { icon: Lock,         label: 'Role-Based Access' },
  { icon: Activity,     label: 'Activity Tracking' },
];

const stats = [
  { value: '500+', label: 'Firms Onboarded' },
  { value: '50K+', label: 'Clients Managed' },
  { value: '2M+',  label: 'Documents Stored' },
  { value: '99.9%',label: 'Uptime SLA' },
];

export default function SocialProof() {
  return (
    <section className="py-16 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-[#94A3B8] uppercase tracking-wider">
            Built For Modern Professional Firms
          </p>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full text-sm text-[#64748B] font-medium hover:border-[#CBD5E1] hover:bg-white transition-all cursor-default"
            >
              <b.icon size={14} className="text-[#1F2937]" />
              {b.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-4xl font-extrabold text-[#1F2937] tracking-tight">{s.value}</p>
              <p className="text-sm text-[#64748B] mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
