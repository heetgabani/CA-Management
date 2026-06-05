'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface Tab {
  key: string;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1" style={{ borderBottom: '1px solid #E5E7EB' }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px',
            active === tab.key
              ? 'border-[#111827] text-[#111827]'
              : 'border-transparent text-[#6B7280] hover:text-[#374151]',
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: active === tab.key ? '#111827' : '#F3F4F6',
                color: active === tab.key ? '#FFFFFF' : '#6B7280',
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
