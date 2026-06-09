'use client';
import { CheckSquare } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  PENDING:      'bg-[#FFFBEB]',
  IN_PROGRESS:  'bg-[#F1F5F9]',
  UNDER_REVIEW: 'bg-[#F1F5F9]',
  COMPLETED:    'bg-[#ECFDF5]',
  CANCELLED:    'bg-[#FEF2F2]',
  ON_HOLD:      'bg-[#FFFBEB]',
};

const STATUS_TEXT: Record<string, string> = {
  PENDING:      'text-[#F59E0B]',
  IN_PROGRESS:  'text-[#64748B]',
  UNDER_REVIEW: 'text-[#64748B]',
  COMPLETED:    'text-[#10B981]',
  CANCELLED:    'text-[#EF4444]',
  ON_HOLD:      'text-[#F59E0B]',
};

export function TaskSummary({ data }: { data?: { status: string; count: number }[] }) {
  const tasks = data || [];
  const total = tasks.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-[#64748B]" />
          <h3 className="text-sm font-semibold text-[#1F2937]">Tasks Overview</h3>
        </div>
        <Link href="/dashboard/tasks" className="text-xs text-[#64748B] hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tasks.map((t) => (
          <div key={t.status} className={`rounded-xl p-3.5 ${STATUS_COLORS[t.status] || 'bg-[#F1F5F9]'}`}>
            <p className={`text-2xl font-bold ${STATUS_TEXT[t.status] || 'text-[#64748B]'}`}>{t.count}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{t.status.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
      {total === 0 && <p className="text-center text-sm text-[#9CA3AF] py-4">No tasks yet</p>}
    </div>
  );
}
