export const brand = {
  name: 'LedgerFlow',
  tagline: 'The Digital Operating System For Professional Firms',
  logoText: 'LF',
  url: 'https://ledgerflow.in',
} as const;

// Single source of truth for all design tokens
export const colors = {
  // App surfaces
  background: '#F6F8FA',
  card:        '#FFFFFF',
  sidebar:     '#F9FAFB',

  // Borders
  border:      '#E2E8F0',
  borderInput: '#CBD5E1',

  // Text hierarchy
  text:            '#1F2937',
  textSecondary:   '#64748B',
  textMuted:       '#94A3B8',
  textPlaceholder: '#94A3B8',

  // Muted surfaces
  muted:           '#F1F5F9',
  mutedForeground: '#64748B',

  // Brand (use sparingly — buttons, active states, focus, links)
  brand:            '#4F46E5',
  brandHover:       '#4338CA',
  brandLight:       '#EEF2FF',
  brandForeground:  '#FFFFFF',

  // Semantic status
  success:    '#10B981',
  successBg:  '#ECFDF5',
  warning:    '#F59E0B',
  warningBg:  '#FFFBEB',
  danger:     '#EF4444',
  dangerBg:   '#FEF2F2',
  info:       '#3B82F6',
  infoBg:     '#EFF6FF',
} as const;

export const spacing = {
  xs:  '0.25rem',
  sm:  '0.5rem',
  md:  '1rem',
  lg:  '1.5rem',
  xl:  '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const radius = {
  sm:   '0.375rem',
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  '2xl':'1.25rem',
  '3xl':'1.5rem',
  full: '9999px',
} as const;

export const shadows = {
  xs:  '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  md:  '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  lg:  '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
} as const;

export const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  sizes: {
    xs:   '0.75rem',
    sm:   '0.875rem',
    base: '1rem',
    lg:   '1.125rem',
    xl:   '1.25rem',
    '2xl':'1.5rem',
    '3xl':'1.875rem',
    '4xl':'2.25rem',
    '5xl':'3rem',
  },
} as const;

export const motion = {
  fast:   { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.25, ease: 'easeOut' },
  slow:   { duration: 0.4,  ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 400, damping: 30 },
} as const;

export const theme = { brand: brand, colors, spacing, radius, shadows, typography, motion } as const;
export default theme;
