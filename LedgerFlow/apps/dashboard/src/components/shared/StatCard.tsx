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

export function StatCard({ title, value, subtitle, icon: Icon, iconColor = '#1F2937', iconBg = '#F1F5F9', trend, action }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        {action}
      </div>
      <p className="text-sm mb-1 text-[#64748B]">{title}</p>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
      {subtitle && <p className="text-xs mt-0.5 text-[#94A3B8]">{subtitle}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp size={12} style={{ color: '#10B981' }} />
          ) : (
            <TrendingDown size={12} style={{ color: '#EF4444' }} />
          )}
          <span className="text-xs font-medium" style={{ color: isPositive ? '#10B981' : '#EF4444' }}>
            {isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-[#94A3B8]">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
