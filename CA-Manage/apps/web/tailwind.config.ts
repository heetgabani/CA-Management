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
        border: '#E5E7EB',
        background: '#FAFAFA',
        foreground: '#111827',
        card: '#FFFFFF',
        primary: { DEFAULT: '#111827', foreground: '#F9FAFB' },
        secondary: { DEFAULT: '#F3F4F6', foreground: '#111827' },
        muted: { DEFAULT: '#F3F4F6', foreground: '#6B7280' },
        destructive: { DEFAULT: '#DC2626', foreground: '#FFFFFF' },
        success: '#16A34A',
        warning: '#D97706',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
