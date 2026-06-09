'use client';
import { motion } from 'framer-motion';
import { Calculator, Scale, Receipt, BookOpen, Shield, LineChart, Coins, ClipboardCheck } from 'lucide-react';

const solutions = [
  { icon: Calculator,    title: 'Chartered Accountants',  desc: 'Manage ITR, GST, TDS, Audit, and client documents from one platform.' },
  { icon: Scale,         title: 'Company Secretaries',    desc: 'ROC filings, board resolutions, regulatory compliance, and document management.' },
  { icon: Receipt,       title: 'Tax Consultants',        desc: 'Income tax, advance tax, capital gains, and tax planning for individuals and businesses.' },
  { icon: BookOpen,      title: 'Accounting Firms',       desc: 'Bookkeeping, payroll, accounts finalization, and multi-client management.' },
  { icon: Shield,        title: 'Compliance Consultants', desc: 'FEMA, RBI, SEBI, labor law, and industry-specific compliance tracking.' },
  { icon: LineChart,     title: 'Business Advisors',      desc: 'Financial modeling, business plans, valuations, and strategic advisory services.' },
  { icon: Coins,         title: 'Financial Consultants',  desc: 'Investment advisory, portfolio tracking, insurance, and mutual fund management.' },
  { icon: ClipboardCheck,title: 'Audit Firms',            desc: 'Statutory audit, internal audit, concurrent audit workflows and workpaper management.' },
];

export default function Solutions() {
  return (
    <section id="solutions" className="py-28 bg-[#F6F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold mb-4">
            Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] tracking-tight">
            Built For Every Professional Practice
          </h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
            Whether you&apos;re a solo practitioner or a 50-person firm, LedgerFlow adapts to how you work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:border-[#CBD5E1] hover:shadow-sm transition-all cursor-default"
            >
              <div className="w-11 h-11 bg-[#F1F5F9] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#E2E8F0] transition-colors">
                <s.icon size={19} className="text-[#1F2937]" />
              </div>
              <h3 className="text-sm font-bold text-[#1F2937] mb-2">{s.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
