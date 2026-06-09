'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth.store';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof schema>;

export default function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (params.get('verified') === '1') toast.success('Email verified! You can now sign in.');
  }, []);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="lg:hidden flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4F46E5' }}>
          <span className="font-black text-sm text-white">LF</span>
        </div>
        <span className="font-semibold text-base" style={{ color: '#1F2937' }}>LedgerFlow</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold" style={{ color: '#1F2937' }}>Welcome back</h2>
        <p className="mt-1 text-sm" style={{ color: '#64748B' }}>Sign in to your firm account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Email address</label>
          <input {...register('email')} type="email" autoComplete="email" placeholder="you@yourfirm.com"
            className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
            style={{ border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#1F2937', borderRadius: '12px' }}
            onFocus={e => (e.target.style.borderColor = '#4F46E5')} onBlur={e => (e.target.style.borderColor = '#CBD5E1')} />
          {errors.email && <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium" style={{ color: '#1F2937' }}>Password</label>
            <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: '#4F46E5' }}>Forgot password?</Link>
          </div>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
              className="w-full px-3.5 py-2.5 pr-11 text-sm outline-none transition-all"
              style={{ border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#1F2937', borderRadius: '12px' }}
              onFocus={e => (e.target.style.borderColor = '#4F46E5')} onBlur={e => (e.target.style.borderColor = '#CBD5E1')} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}
          className="w-full py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all"
          style={{ backgroundColor: isSubmitting ? '#4338CA' : '#4F46E5', color: '#FFFFFF', borderRadius: '12px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#4338CA'; }}
          onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#4F46E5'; }}>
          {isSubmitting && <Loader2 size={15} className="animate-spin" />}
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm" style={{ color: '#64748B' }}>
        New to LedgerFlow?{' '}
        <Link href="/register" className="font-medium hover:underline" style={{ color: '#4F46E5' }}>Register your firm</Link>
      </p>
    </div>
  );
}
