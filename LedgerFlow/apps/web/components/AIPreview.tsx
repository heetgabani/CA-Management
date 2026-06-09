'use client';
import { motion } from 'framer-motion';
import { Sparkles, FileSearch, Brain, Bot, Workflow, Zap } from 'lucide-react';

const roadmap = [
  { icon: FileSearch, title: 'Statement Parser',        desc: 'Upload bank statements. Extract transactions, balances, and summaries automatically.',                   status: 'Coming Q3 2025' },
  { icon: Brain,      title: 'OCR Extraction',          desc: 'Extract data from scanned documents, invoices, and receipts using AI vision.',                          status: 'Coming Q3 2025' },
  { icon: Sparkles,   title: 'Document Intelligence',   desc: 'Auto-classify, tag, and index uploaded documents using AI.',                                             status: 'Coming Q4 2025' },
  { icon: Bot,        title: 'AI Compliance Assistant', desc: 'Ask questions about deadlines, regulations, and get instant AI-powered answers.',                       status: 'Coming Q4 2025' },
  { icon: FileSearch, title: 'AI Document Search',      desc: 'Search inside document contents using natural language queries.',                                        status: 'Coming Q1 2026' },
  { icon: Workflow,   title: 'AI Workflow Automation',  desc: 'Automate repetitive compliance workflows with AI-driven task routing.',                                  status: 'Coming Q1 2026' },
];

export default function AIPreview() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold mb-4">
            <Sparkles size={11} className="text-[#1F2937]" />
            Coming Soon
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] tracking-tight">
            AI-Powered Intelligence<br />Is Coming
          </h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
            LedgerFlow is adding a layer of AI intelligence to automate the most time-consuming parts of professional practice management.
          </p>
        </motion.div>

        {/* Highlight card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#111827] rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-white/70 text-xs font-semibold mb-4">
                <Zap size={11} className="text-white" />
                Flagship Feature
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                AI-Powered Statement Parser
              </h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                Upload any bank statement — PDF, Excel, or image. Our AI extracts every transaction, categorizes them, and generates instant financial summaries.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-xl text-white text-sm font-medium cursor-pointer hover:bg-white/15 transition-colors">
                Join Waitlist
                <Sparkles size={13} />
              </div>
            </div>

            {/* Mini mockup */}
            <div className="lg:w-80 w-full">
              <div className="bg-white/8 border border-white/12 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center">
                    <FileSearch size={11} className="text-white" />
                  </div>
                  <p className="text-white/70 text-xs font-semibold">Statement Parser</p>
                  <span className="ml-auto text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full border border-[#F59E0B]/20">AI Processing...</span>
                </div>
                <div className="space-y-2">
                  {[
                    ['HDFC BANK TRANSFER', '₹45,000',   'Income',  '#10B981'],
                    ['GST PAYMENT NSDL',   '₹18,540',   'Tax',     '#F59E0B'],
                    ['SALARY PAYMENT',     '₹1,25,000', 'Payroll', '#64748B'],
                    ['RENT PAYMENT',       '₹35,000',   'Expense', '#EF4444'],
                  ].map(([d, a, c, col]) => (
                    <div key={d} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                      <div>
                        <p className="text-white/60 text-xs font-medium">{d}</p>
                        <span className="text-xs" style={{ color: col }}>{c}</span>
                      </div>
                      <p className="text-white text-xs font-semibold">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#F6F8FA] border border-[#E2E8F0] rounded-2xl p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={15} className="text-[#1F2937]" />
                </div>
                <span className="text-xs text-[#94A3B8] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-full mt-0.5">{item.status}</span>
              </div>
              <h3 className="text-sm font-bold text-[#1F2937] mb-1.5">{item.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
