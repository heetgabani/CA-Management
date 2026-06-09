'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'Is my client data secure on LedgerFlow?', a: 'Absolutely. LedgerFlow uses AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Each firm is completely isolated in its own tenant — your data is never shared with other firms. We also maintain daily backups with 30-day retention.' },
  { q: 'How much document storage do I get?', a: 'The Starter plan includes 10 GB of encrypted document storage — enough for thousands of PDFs and documents. The Professional plan includes 200 GB. Enterprise plans offer custom storage with options for unlimited storage on dedicated infrastructure.' },
  { q: 'Can I track GST, TDS, Audit, and ROC compliance all in one place?', a: "Yes. LedgerFlow's compliance tracker supports GST (monthly, quarterly, annual), TDS (quarterly returns, Form 16), Income Tax (ITR, advance tax), ROC filings (AOC-4, MGT-7, DIR-3 KYC), DSC renewal, Professional Tax, PF/ESI, and fully custom compliance types." },
  { q: 'Is there a limit on how many clients I can add?', a: 'The Starter plan supports up to 500 clients. The Professional plan has no client limit — you can manage an unlimited number of clients. Enterprise plans also have no limit and include additional features for multi-branch firms.' },
  { q: 'How many staff members can I add to my account?', a: 'Starter plan allows up to 3 staff members with role-based access. Professional plan supports unlimited staff with granular role-based permissions — FIRM_OWNER, PARTNER, MANAGER, ACCOUNTANT, EXECUTIVE, and INTERN roles.' },
  { q: 'Can I migrate my existing client data from Excel?', a: 'Yes. LedgerFlow supports bulk client import from Excel/CSV files. Our onboarding team assists Professional and Enterprise customers with data migration. You can also add clients manually one by one or via our API.' },
  { q: 'What happens to my data if I stop using LedgerFlow?', a: 'Your data belongs to you. At any time, you can export all your client data, documents, and records in standard formats (CSV, ZIP). We provide a 90-day data retention period after subscription cancellation before permanent deletion.' },
  { q: 'What support do you provide?', a: 'Starter plan includes email support with 48-hour response time. Professional plan includes priority support with live chat and 4-hour response time. Enterprise plans include a dedicated account manager and phone support.' },
  { q: 'How does billing work? Can I cancel anytime?', a: 'LedgerFlow is billed monthly or annually (annual billing saves 20%). You can cancel your subscription at any time with no cancellation fees. Your account remains active until the end of your current billing period.' },
  { q: 'Does LedgerFlow integrate with Tally, QuickBooks, or other accounting software?', a: 'LedgerFlow is currently a standalone platform with CSV/Excel export capabilities. Native integrations with Tally, Zoho Books, QuickBooks, and WhatsApp Business are on our roadmap for H2 2025. Enterprise plans include custom integration support.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 bg-[#F6F8FA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold mb-4">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[#64748B]">
            Everything you need to know about LedgerFlow.
          </p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-[#F9FAFB] transition-colors"
              >
                <span className="text-sm font-semibold text-[#1F2937]">{faq.q}</span>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${open === i ? 'bg-[#4F46E5] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                  {open === i ? <Minus size={12} /> : <Plus size={12} />}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-sm text-[#64748B] leading-relaxed border-t border-[#F1F5F9] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
