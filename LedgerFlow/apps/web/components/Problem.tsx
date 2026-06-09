'use client';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const before = [
  { text: 'Excel Sheets & Manual Registers' },
  { text: 'Physical Files & Cabinets' },
  { text: 'Scattered Documents Everywhere' },
  { text: 'WhatsApp Follow-Ups' },
  { text: 'No Audit Trail' },
  { text: 'No Team Visibility' },
  { text: 'No Compliance Tracking' },
];

const after = [
  { text: 'Centralized Client Records' },
  { text: 'Digital Document Locker' },
  { text: 'Full-Text Document Search' },
  { text: 'Structured Team Collaboration' },
  { text: 'Complete Activity History' },
  { text: 'Real-Time Team Visibility' },
  { text: 'Compliance Monitoring & Alerts' },
  { text: 'Automated Task Tracking' },
];

export default function Problem() {
  return (
    <section className="py-28 bg-[#F6F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] text-xs font-semibold mb-4">
            The Problem
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] tracking-tight">
            Still Managing Clients Through<br />
            <span className="text-[#EF4444]">Excel Sheets?</span>
          </h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
            Most CA firms are running multi-crore practices on tools designed for household budgets. It&apos;s time for an upgrade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
                <X size={18} className="text-[#EF4444]" />
              </div>
              <div>
                <p className="font-bold text-[#1F2937]">Without LedgerFlow</p>
                <p className="text-sm text-[#64748B]">The old way</p>
              </div>
            </div>
            <div className="space-y-3">
              {before.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 bg-[#FEF2F2] rounded-xl"
                >
                  <X size={14} className="text-[#EF4444] shrink-0" />
                  <span className="text-sm text-[#64748B] line-through decoration-[#FECACA]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                <Check size={18} className="text-[#10B981]" />
              </div>
              <div>
                <p className="font-bold text-[#1F2937]">With LedgerFlow</p>
                <p className="text-sm text-[#64748B]">The modern way</p>
              </div>
            </div>
            <div className="space-y-3">
              {after.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 bg-[#F0FDF4] rounded-xl"
                >
                  <Check size={14} className="text-[#10B981] shrink-0" />
                  <span className="text-sm font-medium text-[#1F2937]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
