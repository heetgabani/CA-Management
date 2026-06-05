'use client';
import { Activity, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity({ data }: { data?: any[] }) {
  const activities = data || [];
  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E5E7EB]">
        <Activity size={16} className="text-[#6B7280]" />
        <h3 className="text-sm font-semibold text-[#111827]">Recent Activity</h3>
      </div>
      <div className="divide-y divide-[#F3F4F6]">
        {activities.slice(0, 8).map((a: any) => (
          <div key={a.id} className="px-5 py-3 hover:bg-[#FAFAFA]">
            <p className="text-sm text-[#374151] leading-snug">{a.description}</p>
            <p className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1">
              <Clock size={10} />
              {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
              {a.client && <span> · {a.client.displayName}</span>}
            </p>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-center py-8 text-sm text-[#9CA3AF]">No recent activity</div>
        )}
      </div>
    </div>
  );
}
