import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: '#F3F4F6' }}
      >
        <Icon size={24} style={{ color: '#9CA3AF' }} />
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>{title}</h3>
      {description && <p className="text-sm max-w-xs" style={{ color: '#6B7280' }}>{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
