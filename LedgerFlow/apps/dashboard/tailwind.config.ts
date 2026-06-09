import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      colors: {
        background: '#F6F8FA',
        card:       '#FFFFFF',
        sidebar:    '#F9FAFB',
        border:     '#E2E8F0',
        foreground: '#1F2937',
        muted: {
          DEFAULT:    '#F1F5F9',
          foreground: '#64748B',
        },
        primary: {
          DEFAULT:    '#4F46E5',
          foreground: '#FFFFFF',
          hover:      '#4338CA',
          light:      '#EEF2FF',
        },
        secondary: {
          DEFAULT:    '#F1F5F9',
          foreground: '#1F2937',
        },
        destructive: {
          DEFAULT:    '#EF4444',
          foreground: '#FFFFFF',
        },
        success: { DEFAULT: '#10B981', bg: '#ECFDF5' },
        warning: { DEFAULT: '#F59E0B', bg: '#FFFBEB' },
        danger:  { DEFAULT: '#EF4444', bg: '#FEF2F2' },
        info:    { DEFAULT: '#3B82F6', bg: '#EFF6FF' },
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        xs:      '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        sm:      '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        md:      '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        lg:      '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
