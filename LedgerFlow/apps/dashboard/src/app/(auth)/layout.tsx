import { AuthBranding } from '@/components/layout/AuthBranding';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F6F8FA' }}>
      {/* Left branding panel — desktop only */}
      <AuthBranding />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
