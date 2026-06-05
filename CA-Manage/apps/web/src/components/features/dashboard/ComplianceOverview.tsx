'use client';
import { Shield, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export function ComplianceOverview({ data }: { data?: any }) {
  const overdue = data?.overdue || [];
  const dueSoon = data?.dueSoon || [];

  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#6B7280]" />
          <h3 className="text-sm font-semibold text-[#111827]">Compliance Due</h3>
        </div>
        <Link href="/compliance" className="text-xs text-[#6B7280] hover:text-[#111827] hover:underline">View all</Link>
      </div>
      <div className="divide-y divide-[#F3F4F6]">
        {[...overdue.map((c: any) => ({ ...c, isOverdue: true })), ...dueSoon].slice(0, 6).map((c: any) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA]">
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.isOverdue ? 'bg-red-500' : 'bg-amber-400'}`} />
              <div>
                <p className="text-sm font-medium text-[#111827]">{c.title}</p>
                <p className="text-xs text-[#9CA3AF]">{c.client?.displayName}</p>
              </div>
            </div>
            <div className="text-right">
              {c.isOverdue
                ? <span className="badge-danger">Overdue</span>
                : <span className="text-xs text-[#6B7280]">{format(new Date(c.dueDate), 'dd MMM')}</span>
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
