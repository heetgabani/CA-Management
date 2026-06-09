'use client';
import { motion } from 'framer-motion';

const features = [
  'Digital client file locker',
  'Compliance tracker & reminders',
  'Physical file management',
  'Task & staff management',
];

export function AuthBranding() {
  return (
    <div
      className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col justify-between p-12"
      style={{ backgroundColor: '#1F2937' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <span className="font-black text-base" style={{ color: '#1F2937' }}>LF</span>
        </div>
        <span className="font-semibold text-lg" style={{ color: '#FFFFFF' }}>LedgerFlow</span>
      </div>

      {/* Main copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight" style={{ color: '#FFFFFF' }}>
            Your complete<br />
            <span style={{ color: '#9CA3AF' }}>firm management</span><br />
            platform.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#9CA3AF' }}>
            Replace Excel sheets, Google Drive chaos, and physical registers with one
            powerful cloud platform built for CA, CS, and Tax professionals.
          </p>
        </div>

        <div className="space-y-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFFFFF' }} />
              </div>
              <span className="text-sm" style={{ color: '#CBD5E1' }}>{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <p className="text-sm" style={{ color: '#4B5563' }}>
        © 2025 LedgerFlow. All rights reserved.
      </p>
    </div>
  );
}
