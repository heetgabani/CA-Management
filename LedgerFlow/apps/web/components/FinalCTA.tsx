'use client';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#4F46E5] rounded-3xl overflow-hidden p-12 sm:p-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/60 text-xs font-semibold mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Limited Time Offer — 3 Months Free
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            Ready To Modernize<br />Your Firm?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/55 text-lg max-w-2xl mx-auto mb-10"
          >
            Stop managing your firm through spreadsheets, folders, and disconnected tools. Join hundreds of CA and CS firms already running on LedgerFlow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
          >
            <a
              href="http://localhost:3000/register"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1F2937] text-sm font-semibold rounded-xl hover:bg-[#F9FAFB] transition-colors"
            >
              Start Free Trial
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="http://localhost:3000/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/8 border border-white/15 text-white text-sm font-semibold rounded-xl hover:bg-white/12 transition-colors"
            >
              Book a Demo
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {['No Credit Card Required', 'Setup in 10 Minutes', 'Free Data Migration Help', 'Cancel Anytime'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-white/40">
                <CheckCircle2 size={12} className="text-[#10B981]" />
                {t}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
