'use client';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export function ComplianceOverview({ data }: { data?: any }) {
  const overdue = data?.overdue || [];
  const dueSoon = data?.dueSoon || [];

  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#64748B]" />
          <h3 className="text-sm font-semibold text-[#1F2937]">Compliance Due</h3>
        </div>
        <Link href="/dashboard/compliance" className="text-xs text-[#64748B] hover:text-[#1F2937] hover:underline">View all</Link>
      </div>
      <div className="divide-y divide-[#F1F5F9]">
        {[...overdue.map((c: any) => ({ ...c, isOverdue: true })), ...dueSoon].slice(0, 6).map((c: any) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F6F8FA]">
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.isOverdue ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`} />
              <div>
                <p className="text-sm font-medium text-[#1F2937]">{c.title}</p>
                <p className="text-xs text-[#9CA3AF]">{c.client?.displayName}</p>
              </div>
            </div>
            <div className="text-right">
              {c.isOverdue
                ? <span className="badge-danger">Overdue</span>
                : <span className="text-xs text-[#64748B]">{format(new Date(c.dueDate), 'dd MMM')}</span>
              }
            </div>
          </div>
        ))}
        {overdue.length === 0 && dueSoon.length === 0 && (
          <div className="text-center py-8 text-sm text-[#9CA3AF]">No pending compliances</div>
        )}
      </div>
    </div>
  );
}
