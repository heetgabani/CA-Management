'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, Bell, Users, Activity, FileText } from 'lucide-react';

const complianceTypes = [
  { label: 'GST Returns',       sub: 'GSTR-1 · GSTR-3B · GSTR-9 · GSTR-9C',      due: 'Monthly / Quarterly' },
  { label: 'TDS / TCS',         sub: 'Quarterly returns · 26QB · Form 16/16A',     due: 'Quarterly' },
  { label: 'Income Tax',        sub: 'ITR-1 to ITR-7 · Advance Tax · Tax Audit',   due: 'Annual' },
  { label: 'ROC Filings',       sub: 'AOC-4 · MGT-7 · DIR-3 KYC · INC-20A',       due: 'Annual' },
  { label: 'DSC Management',    sub: 'Expiry tracking · Renewal alerts · Class 3',  due: 'On Expiry' },
  { label: 'Custom Compliance', sub: 'FEMA · SEBI · Labour law · Industry-specific',due: 'As Required' },
];

const features = [
  { icon: Bell,          text: 'Automated reminders before due dates' },
  { icon: Users,         text: 'Assign to specific staff members' },
  { icon: CheckCircle2,  text: 'Real-time status tracking' },
  { icon: Activity,      text: 'Full history & audit trail' },
  { icon: FileText,      text: 'Attach filed documents' },
];

export default function Compliance() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#F59E0B] text-xs font-semibold mb-6">
              Compliance Management
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight mb-5">
              Never Miss<br />Important Deadlines
            </h2>
            <p className="text-[#64748B] text-lg leading-relaxed mb-8">
              Track all statutory compliance — GST, TDS, Audit, ROC, DSC, and custom requirements — with automated reminders and status tracking.
            </p>

            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0">
                    <f.icon size={14} className="text-[#1F2937]" />
                  </div>
                  <p className="text-sm text-[#64748B] font-medium">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {complianceTypes.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#CBD5E1] hover:shadow-sm transition-all cursor-default"
              >
                <div className="w-2 h-2 bg-[#4F46E5] rounded-full mb-3" />
                <h3 className="text-sm font-bold text-[#1F2937] mb-1">{c.label}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">{c.sub}</p>
                <div className="inline-flex items-center gap-1 text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                  <Bell size={9} />
                  {c.due}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
