'use client';
import { CheckSquare } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-[#F3F4F6]',
  IN_PROGRESS: 'bg-blue-100',
  UNDER_REVIEW: 'bg-purple-100',
  COMPLETED: 'bg-green-100',
  CANCELLED: 'bg-red-100',
  ON_HOLD: 'bg-amber-100',
};

const STATUS_TEXT: Record<string, string> = {
  PENDING: 'text-[#6B7280]',
  IN_PROGRESS: 'text-blue-700',
  UNDER_REVIEW: 'text-purple-700',
  COMPLETED: 'text-green-700',
  CANCELLED: 'text-red-700',
  ON_HOLD: 'text-amber-700',
};

export function TaskSummary({ data }: { data?: { status: string; count: number }[] }) {
  const tasks = data || [];
  const total = tasks.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-[#6B7280]" />
          <h3 className="text-sm font-semibold text-[#111827]">Tasks Overview</h3>
        </div>
        <Link href="/tasks" className="text-xs text-[#6B7280] hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tasks.map((t) => (
          <div key={t.status} className={`rounded-xl p-3.5 ${STATUS_COLORS[t.status] || 'bg-[#F3F4F6]'}`}>
            <p className={`text-2xl font-bold ${STATUS_TEXT[t.status] || 'text-[#374151]'}`}>{t.count}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{t.status.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
      {total === 0 && <p className="text-center text-sm text-[#9CA3AF] py-4">No tasks yet</p>}
    </div>
  );
}
