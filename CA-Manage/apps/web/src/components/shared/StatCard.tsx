import { ReactNode } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  action?: ReactNode;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColor = '#111827', iconBg = '#F3F4F6', trend, action }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#E5E7EB' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        {action}
      </div>
      <p className="text-sm mb-1" style={{ color: '#6B7280' }}>{title}</p>
      <p className="text-2xl font-bold" style={{ color: '#111827' }}>{value}</p>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{subtitle}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp size={12} style={{ color: '#16A34A' }} />
          ) : (
            <TrendingDown size={12} style={{ color: '#DC2626' }} />
          )}
          <span className="text-xs font-medium" style={{ color: isPositive ? '#16A34A' : '#DC2626' }}>
            {isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
