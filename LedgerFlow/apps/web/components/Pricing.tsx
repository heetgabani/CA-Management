'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    desc: 'Perfect for solo practitioners and small firms just getting started.',
    features: ['Up to 500 Clients', '10 GB Document Storage', '3 Staff Members', 'Client Management', 'Document Locker', 'Task Management', 'Email Support'],
    cta: 'Start Free Trial',
    highlight: false,
    badge: null,
  },
  {
    name: 'Professional',
    price: '₹2,999',
    period: '/month',
    desc: 'For growing firms that need full compliance tracking and team collaboration.',
    features: ['Unlimited Clients', '200 GB Storage', 'Unlimited Staff', 'Full Compliance Tracking', 'Physical File Tracking', 'Advanced Reports & Analytics', 'Audit Logs', 'Priority Support', 'Role-Based Permissions', 'API Access'],
    cta: 'Start Free Trial',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For multi-branch firms and enterprise practices with custom requirements.',
    features: ['Custom Client Limits', 'Custom Storage', 'Multiple Branches', 'Dedicated Account Manager', 'Custom Integrations', 'SLA Guarantee', 'On-boarding Assistance', 'Custom Training', 'White-labeling Available', 'SSO / SAML'],
    cta: 'Contact Sales',
    highlight: false,
    badge: null,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-[#F6F8FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold mb-4">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl mx-auto">
            No hidden fees. No per-user charges. Start free, upgrade when you&apos;re ready.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={cn(
                'relative rounded-3xl p-8 border transition-all',
                plan.highlight
                  ? 'bg-[#4F46E5] border-[#4F46E5] shadow-lg scale-105'
                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-sm'
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#10B981] text-white text-xs font-bold rounded-full">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className={cn('text-sm font-semibold mb-1', plan.highlight ? 'text-white/60' : 'text-[#64748B]')}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className={cn('text-4xl font-extrabold tracking-tight', plan.highlight ? 'text-white' : 'text-[#1F2937]')}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={cn('text-sm mb-1.5', plan.highlight ? 'text-white/50' : 'text-[#64748B]')}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={cn('text-sm mt-2 leading-relaxed', plan.highlight ? 'text-white/55' : 'text-[#64748B]')}>
                  {plan.desc}
                </p>
              </div>

              <a
                href="http://localhost:3000/register"
                className={cn(
                  'block text-center py-3 rounded-xl text-sm font-semibold transition-colors mb-8',
                  plan.highlight
                    ? 'bg-white text-[#1F2937] hover:bg-[#F9FAFB]'
                    : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                )}
              >
                {plan.cta}
              </a>

              <div className="space-y-3">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0', plan.highlight ? 'bg-white/15' : 'bg-[#F1F5F9]')}>
                      <Check size={10} className={plan.highlight ? 'text-white' : 'text-[#10B981]'} strokeWidth={3} />
                    </div>
                    <span className={cn('text-sm', plan.highlight ? 'text-white/75' : 'text-[#64748B]')}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#94A3B8] mt-10"
        >
          All plans include 14-day free trial · No credit card required · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
