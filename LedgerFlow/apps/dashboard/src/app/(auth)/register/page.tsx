'use client';
import { useState, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';

const schema = z.object({
  firmName: z.string().min(2, 'Firm name must be at least 2 characters'),
  firmEmail: z.string().email('Enter a valid email'),
  firmPhone: z.string().optional(),
  gstNumber: z.string().optional(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Form = z.infer<typeof schema>;

const inputStyle = {
  border: '1px solid #CBD5E1',
  backgroundColor: '#FFFFFF',
  color: '#1F2937',
  borderRadius: '12px',
};

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ style, onFocus, onBlur, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className="w-full px-3.5 py-2.5 text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = '#4F46E5')}
        onBlur={e => (e.target.style.borderColor = '#CBD5E1')}
      />
    );
  }
);

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const nextStep = async () => {
    const valid = await trigger(['firmName', 'firmEmail', 'firmPhone', 'gstNumber']);
    if (valid) setStep(1);
  };

  const onSubmit = async (data: Form) => {
    try {
      const { confirmPassword: _, ...payload } = data;
      await apiClient.post('/auth/register', payload);
      toast.success('Registration successful! Please verify your email.');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&purpose=EMAIL_VERIFICATION`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const steps = ['Firm Details', 'Your Account'];

  return (
    <div className="space-y-7">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4F46E5' }}>
          <span className="font-black text-sm text-white">LF</span>
        </div>
        <span className="font-semibold" style={{ color: '#1F2937' }}>LedgerFlow</span>
      </div>

      <div>
        <h2 className="text-2xl font-bold" style={{ color: '#1F2937' }}>Register your firm</h2>
        <p className="mt-1 text-sm" style={{ color: '#64748B' }}>Get started — free for 14 days</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
              style={{
                backgroundColor: i <= step ? '#4F46E5' : '#E2E8F0',
                color: i <= step ? '#FFFFFF' : '#64748B',
              }}
            >
              {i + 1}
            </div>
            <span className="text-xs font-medium" style={{ color: i === step ? '#1F2937' : '#64748B' }}>{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Firm / Practice name *</label>
              <Input {...register('firmName')} placeholder="Sharma & Associates" />
              {errors.firmName && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.firmName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Firm email *</label>
              <Input {...register('firmEmail')} type="email" placeholder="info@yourfirm.com" />
              {errors.firmEmail && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.firmEmail.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Phone</label>
                <Input {...register('firmPhone')} placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>GST Number</label>
                <Input {...register('gstNumber')} placeholder="27AABCS..." />
              </div>
            </div>
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: '#4F46E5', color: '#FFFFFF', borderRadius: '12px' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4338CA')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4F46E5')}
            >
              Continue <ChevronRight size={15} />
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>First name *</label>
                <Input {...register('firstName')} placeholder="Rajesh" />
                {errors.firstName && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Last name *</label>
                <Input {...register('lastName')} placeholder="Sharma" />
                {errors.lastName && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Your email *</label>
              <Input {...register('email')} type="email" placeholder="you@yourfirm.com" />
              {errors.email && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Password *</label>
              <div className="relative">
                <Input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1F2937' }}>Confirm password *</label>
              <Input {...register('confirmPassword')} type="password" placeholder="Repeat password" />
              {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{ border: '1px solid #E2E8F0', color: '#1F2937', borderRadius: '12px', backgroundColor: '#FFFFFF' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#4338CA'; }}
                onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#4F46E5'; }}
              >
                {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                Create account
              </button>
            </div>
          </>
        )}
      </form>

      <p className="text-center text-sm" style={{ color: '#64748B' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-medium hover:underline" style={{ color: '#4F46E5' }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
