'use client';
import { motion } from 'framer-motion';
import { Building2, UserPlus, Upload, FolderOpen, Shield, Zap } from 'lucide-react';

const steps = [
  { icon: Building2, num: '01', title: 'Create Your Firm',         desc: 'Register your firm, add your logo, and configure your workspace in minutes.' },
  { icon: UserPlus,  num: '02', title: 'Invite Team Members',      desc: 'Add staff with role-based access — Partners, Managers, Accountants, Executives.' },
  { icon: Upload,    num: '03', title: 'Import Existing Clients',   desc: 'Bulk import your client list from Excel or add clients one by one.' },
  { icon: FolderOpen,num: '04', title: 'Upload Documents',         desc: 'Organize all client documents in structured digital folders — KYC, GST, ITR, Audit.' },
  { icon: Shield,    num: '05', title: 'Track Compliance & Tasks',  desc: 'Never miss a deadline. Track GST, TDS, ROC, Audit, DSC with automated reminders.' },
  { icon: Zap,       num: '06', title: 'Operate From One Workspace',desc: 'Your entire firm — clients, staff, documents, compliance — all in one place.' },
];

export default function Workflow() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] text-xs font-semibold mb-4">
            Get Started In Minutes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] tracking-tight">
            How LedgerFlow Works
          </h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
            From setup to full operations in one afternoon. No technical knowledge required.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-[#E2E8F0]" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative group"
              >
                <div className="relative z-10 w-14 h-14 mx-auto lg:mx-0 rounded-2xl bg-[#4F46E5] flex items-center justify-center mb-5 group-hover:bg-[#4338CA] transition-colors">
                  <step.icon size={20} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center shadow-xs">
                    <span className="text-xs font-bold text-[#1F2937]">{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-2 text-center lg:text-left">{step.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed text-center lg:text-left">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
