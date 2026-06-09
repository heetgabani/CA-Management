import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const styles: Record<Variant, { bg: string; color: string }> = {
  default: { bg: '#F1F5F9', color: '#64748B' },
  success: { bg: '#ECFDF5', color: '#10B981' },
  warning: { bg: '#FFFBEB', color: '#F59E0B' },
  danger:  { bg: '#FEF2F2', color: '#EF4444' },
  info:    { bg: '#EFF6FF', color: '#3B82F6' },
};

interface BadgeProps {
  label: string;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

export function Badge({ label, variant = 'default', dot = false, className }: BadgeProps) {
  const s = styles[variant];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', className)}
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
      )}
      {label}
    </span>
  );
}
