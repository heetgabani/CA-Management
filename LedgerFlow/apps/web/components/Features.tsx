'use client';
import { motion } from 'framer-motion';
import { Users, FolderOpen, Shield, CheckSquare, Building2, Archive, ClipboardList, BarChart3 } from 'lucide-react';

const features = [
  { icon: Users,        title: 'Client Management',      desc: 'Complete client profiles with contact details, tax identifiers, staff assignments, notes, and full activity history in one place.',         size: 'lg' },
  { icon: FolderOpen,   title: 'Digital Client Locker',   desc: 'Structured folders for KYC, GST, ITR, Audit documents with version history and secure sharing.',                                           size: 'md' },
  { icon: Shield,       title: 'Compliance Tracking',     desc: 'Track GST, TDS, Audit, DSC, ROC deadlines with automated reminders.',                                                                      size: 'md' },
  { icon: CheckSquare,  title: 'Task Management',         desc: 'Assign, monitor, and track work across your team with priorities and due dates.',                                                           size: 'sm' },
  { icon: Building2,    title: 'Staff Management',        desc: 'Manage roles, permissions, workloads, and performance for your entire team.',                                                              size: 'sm' },
  { icon: Archive,      title: 'Physical File Tracking',  desc: 'Track box numbers, cabinet locations, and movement history of physical files.',                                                             size: 'sm' },
  { icon: ClipboardList,title: 'Audit Logs',              desc: 'Immutable logs of every action — who did what, when, and from where.',                                                                     size: 'md' },
  { icon: BarChart3,    title: 'Reports & Analytics',     desc: 'Insights into firm operations, staff productivity, compliance rates, and client activity.',                                                size: 'md' },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:border-[#CBD5E1] hover:shadow-sm transition-all cursor-default"
    >
      <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center mb-4 group-hover:bg-[#E2E8F0] transition-colors">
        <feature.icon size={18} className="text-[#1F2937]" />
      </div>
      <h3 className="text-base font-bold text-[#1F2937] mb-2">{feature.title}</h3>
      <p className="text-sm text-[#64748B] leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold mb-4">
            Everything You Need
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] tracking-tight">
            One Platform. Every Function.
          </h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
            Replace every disconnected tool your firm uses with a unified workspace built for professional service firms.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <FeatureCard feature={features[0]} index={0} />
          </div>
          <FeatureCard feature={features[1]} index={1} />
          <FeatureCard feature={features[2]} index={2} />

          <div className="grid grid-cols-2 gap-4 lg:col-span-1">
            <FeatureCard feature={features[3]} index={3} />
            <FeatureCard feature={features[4]} index={4} />
          </div>

          <FeatureCard feature={features[5]} index={5} />
          <FeatureCard feature={features[6]} index={6} />

          {/* Large card — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <FeatureCard feature={features[7]} index={7} />
          </div>
        </div>
      </div>
    </section>
  );
}
