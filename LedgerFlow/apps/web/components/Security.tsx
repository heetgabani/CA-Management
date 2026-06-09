'use client';
import { motion } from 'framer-motion';
import { Lock, Shield, Database, Key, ClipboardList, HardDrive, Link, Activity } from 'lucide-react';

const security = [
  { icon: Lock,         title: 'Role-Based Access Control', desc: 'Granular permissions — Owner, Partner, Manager, Accountant, Executive, Intern roles.' },
  { icon: Database,     title: 'Tenant Isolation',          desc: 'Complete data isolation between firms. Your data is never mixed with other tenants.' },
  { icon: Shield,       title: 'Encrypted Documents',       desc: 'All documents encrypted at rest and in transit using AES-256 and TLS 1.3.' },
  { icon: Key,          title: 'Secure Authentication',     desc: 'JWT-based authentication with OTP verification, 2FA support, and session management.' },
  { icon: ClipboardList,title: 'Audit Logging',             desc: 'Immutable audit trail for every action — who accessed, modified, or deleted what and when.' },
  { icon: HardDrive,    title: 'Daily Backups',             desc: 'Automated daily backups with point-in-time recovery. Your data is never lost.' },
  { icon: Link,         title: 'Signed URLs',               desc: 'Documents shared via time-limited signed URLs. No public exposure of files.' },
  { icon: Activity,     title: 'Activity Monitoring',       desc: 'Real-time activity feeds with anomaly detection and alerting.' },
];

export default function Security() {
  return (
    <section className="py-28 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-white/12 text-white/60 text-xs font-semibold mb-4">
            <Shield size={11} className="text-[#10B981]" />
            Enterprise Security
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Enterprise-Grade Security
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
            Your clients&apos; sensitive financial data is protected by multiple layers of security at every level.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {security.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group bg-white/5 border border-white/8 rounded-2xl p-5 hover:bg-white/8 transition-all cursor-default"
            >
              <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/12 transition-colors">
                <s.icon size={17} className="text-white/70" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
