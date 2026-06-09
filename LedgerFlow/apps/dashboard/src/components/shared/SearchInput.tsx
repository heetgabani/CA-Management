'use client';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-8 pr-8 text-sm rounded-xl outline-none transition-all"
        style={{ border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#1F2937', width: '240px' }}
        onFocus={e => (e.target.style.borderColor = '#4F46E5')}
        onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2"
          style={{ color: '#9CA3AF' }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
