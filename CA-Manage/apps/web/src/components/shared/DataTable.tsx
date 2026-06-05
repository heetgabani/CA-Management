'use client';
import { ReactNode } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { FileText } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor?: (row: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns, data, loading, sortKey, sortDir, onSort, onRowClick,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or add a new record.',
  keyExtractor,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: '#9CA3AF' }} />
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState icon={FileText} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 font-medium"
                style={{ color: '#6B7280', width: col.width }}
              >
                {col.sortable ? (
                  <button
                    onClick={() => onSort?.(col.key)}
                    className="flex items-center gap-1 hover:text-[#111827] transition-colors"
                  >
                    {col.label}
                    <span className="flex flex-col">
                      <ChevronUp size={10} style={{ opacity: sortKey === col.key && sortDir === 'asc' ? 1 : 0.3 }} />
                      <ChevronDown size={10} style={{ opacity: sortKey === col.key && sortDir === 'desc' ? 1 : 0.3, marginTop: '-2px' }} />
                    </span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={keyExtractor ? keyExtractor(row) : idx}
              onClick={() => onRowClick?.(row)}
              className="transition-colors"
              style={{
                borderBottom: '1px solid #F3F4F6',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLElement).style.backgroundColor = '#F9FAFB'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4" style={{ color: '#111827' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
