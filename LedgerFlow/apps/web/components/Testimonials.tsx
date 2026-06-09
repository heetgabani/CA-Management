'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  { name: 'CA Pradeep Shah',    firm: 'Shah & Co. Chartered Accountants', location: 'Surat, Gujarat',      role: 'Managing Partner', initials: 'PS', review: 'LedgerFlow completely transformed how we operate. We went from managing 200+ clients across Excel sheets and WhatsApp to a fully centralized platform. The compliance tracking alone saves us 10+ hours every month.' },
  { name: 'CS Meenakshi Iyer',  firm: 'Iyer Corporate Services',          location: 'Chennai, Tamil Nadu',  role: 'Principal CS',     initials: 'MI', review: 'As a CS firm, ROC compliance tracking used to be a nightmare. With LedgerFlow, all our deadlines are visible in one place, assigned to the right staff, with automated reminders. Game changer.' },
  { name: 'CA Ramesh Jain',     firm: 'Jain & Associates',                location: 'Ahmedabad, Gujarat',   role: 'Founder',          initials: 'RJ', review: "The physical file tracking feature is something I didn't know I needed. We have 500+ physical files and I can now tell exactly where any file is within seconds. No more searching through cabinets." },
  { name: 'CA Pooja Nair',      firm: 'Nair & Partners',                  location: 'Mumbai, Maharashtra',  role: 'Partner',          initials: 'PN', review: 'The client document locker is brilliant. Clients can see their own documents without calling us every time. Staff productivity has improved significantly since we stopped managing document requests manually.' },
  { name: 'CA Vikram Saxena',   firm: 'Saxena Consulting Group',          location: 'Delhi, NCR',           role: 'Proprietor',       initials: 'VS', review: 'I was skeptical about switching from Excel but the migration was seamless. The audit log feature gives me complete visibility of everything happening in my firm. I can see who did what, when.' },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(i => (i + 1) % testimonials.length);
  const t = testimonials[current];

  return (
    <section className="py-28 bg-[#F6F8FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Trusted By Professional Firms
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] p-8 sm:p-12"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl sm:text-2xl text-[#1F2937] leading-relaxed font-medium mb-8">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{t.initials}</span>
                </div>
                <div>
                  <p className="font-bold text-[#1F2937]">{t.name}</p>
                  <p className="text-sm text-[#64748B]">{t.role} · {t.firm}</p>
                  <p className="text-xs text-[#94A3B8]">{t.location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-[#4F46E5]' : 'w-2 h-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} className="w-10 h-10 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-[#CBD5E1] hover:text-[#1F2937] transition-all">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} className="w-10 h-10 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:border-[#CBD5E1] hover:text-[#1F2937] transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
