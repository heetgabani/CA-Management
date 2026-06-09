'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btn = (label: ReactNode, active: boolean, disabled: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all"
      style={{
        backgroundColor: active ? '#4F46E5' : 'transparent',
        color: active ? '#FFFFFF' : disabled ? '#CBD5E1' : '#1F2937',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '1px solid',
        borderColor: active ? '#4F46E5' : '#E2E8F0',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
      <p className="text-xs" style={{ color: '#64748B' }}>
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        {btn(<ChevronLeft size={14} />, false, page === 1, () => onChange(page - 1))}
        {pages.map((p, i) =>
          p === '...'
            ? <span key={i} className="text-sm px-1" style={{ color: '#9CA3AF' }}>…</span>
            : btn(p, p === page, false, () => onChange(p as number))
        )}
        {btn(<ChevronRight size={14} />, false, page === totalPages, () => onChange(page + 1))}
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
