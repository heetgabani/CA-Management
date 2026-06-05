'use client';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ color: '#D1D5DB' }}>/</span>}
                {item.href ? (
                  <a href={item.href} className="text-xs hover:underline" style={{ color: '#6B7280' }}>{item.label}</a>
                ) : (
                  <span className="text-xs" style={{ color: '#6B7280' }}>{item.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-xl font-bold" style={{ color: '#111827' }}>{title}</h1>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0 ml-4">{actions}</div>}
    </div>
  );
}
