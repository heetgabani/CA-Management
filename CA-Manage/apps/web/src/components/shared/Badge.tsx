import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange';

const styles: Record<Variant, { bg: string; color: string }> = {
  default:  { bg: '#F3F4F6', color: '#374151' },
  success:  { bg: '#DCFCE7', color: '#15803D' },
  warning:  { bg: '#FEF9C3', color: '#A16207' },
  danger:   { bg: '#FEE2E2', color: '#B91C1C' },
  info:     { bg: '#DBEAFE', color: '#1D4ED8' },
  purple:   { bg: '#F3E8FF', color: '#7E22CE' },
  orange:   { bg: '#FFEDD5', color: '#C2410C' },
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
