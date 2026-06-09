'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

export default function VerifyOtpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const purpose = params.get('purpose') || 'EMAIL_VERIFICATION';

  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const submitOtp = async (otp: string) => {
    if (otp.length < 4 || loading) return;
    setLoading(true);
    try {
      await apiClient.post('/auth/verify-otp', { email, otp, purpose });
      toast.success('Email verified successfully!');
      router.push(purpose === 'EMAIL_VERIFICATION' ? '/login?verified=1' : `/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setDigits(['', '', '', '']);
      inputRefs[0].current?.focus();
    } finally { setLoading(false); }
  };

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[index] = cleaned; setDigits(next);
    if (cleaned && index < 3) inputRefs[index + 1].current?.focus();
    if (cleaned && index === 3) { const otp = [...next.slice(0, 3), cleaned].join(''); if (otp.length === 4) submitOtp(otp); }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs[index - 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    const next = ['', '', '', '']; pasted.split('').forEach((ch, i) => { next[i] = ch; }); setDigits(next);
    inputRefs[Math.min(pasted.length, 3)].current?.focus();
    if (pasted.length === 4) submitOtp(pasted);
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    try {
      await apiClient.post('/auth/send-otp', { email, purpose });
      toast.success('New OTP sent!'); setCountdown(60); setDigits(['', '', '', '']); inputRefs[0].current?.focus();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to resend OTP'); }
    finally { setResending(false); }
  };

  const otp = digits.join('');

  return (
    <div className="space-y-8">
      <div className="lg:hidden flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4F46E5' }}>
          <span className="font-black text-sm text-white">CA</span>
        </div>
        <span className="font-semibold" style={{ color: '#1F2937' }}>LedgerFlow</span>
      </div>
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F1F5F9' }}>
          <ShieldCheck size={22} style={{ color: '#1F2937' }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1F2937' }}>
            {purpose === 'EMAIL_VERIFICATION' ? 'Verify your email' : 'Enter reset code'}
          </h2>
          <p className="mt-1 text-sm" style={{ color: '#64748B' }}>
            Enter the 4-digit code sent to <span className="font-medium" style={{ color: '#1F2937' }}>{email}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF9C3', border: '1px solid #FDE68A', color: '#92400E' }}>
        <span className="font-semibold">Dev mode:</span> Use OTP <span className="font-mono font-bold tracking-widest">8888</span>
      </div>
      <div className="flex gap-3 justify-center" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input key={i} ref={inputRefs[i]} type="text" inputMode="numeric" maxLength={1} value={digit} autoFocus={i === 0}
            onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
            className="w-14 h-14 text-center text-2xl font-bold outline-none transition-all"
            style={{ border: `2px solid ${digit ? '#4F46E5' : '#E2E8F0'}`, borderRadius: '14px', backgroundColor: '#FFFFFF', color: '#1F2937' }}
            onFocus={e => (e.target.style.borderColor = '#4F46E5')}
            onBlur={e => (e.target.style.borderColor = digit ? '#4F46E5' : '#E2E8F0')} />
        ))}
      </div>
      <button type="button" disabled={otp.length < 4 || loading} onClick={() => submitOtp(otp)}
        className="w-full py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all"
        style={{ backgroundColor: otp.length < 4 || loading ? '#9CA3AF' : '#4F46E5', color: '#FFFFFF', borderRadius: '12px', cursor: otp.length < 4 || loading ? 'not-allowed' : 'pointer' }}>
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      <div className="text-center text-sm" style={{ color: '#64748B' }}>
        Didn&apos;t receive the code?{' '}
        {countdown > 0
          ? <span style={{ color: '#9CA3AF' }}>Resend in {countdown}s</span>
          : <button type="button" onClick={handleResend} disabled={resending} className="font-medium inline-flex items-center gap-1 hover:underline" style={{ color: '#1F2937' }}>
              {resending ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />} Resend OTP
            </button>}
      </div>
      <p className="text-center text-sm" style={{ color: '#64748B' }}>
        <Link href="/login" className="font-medium hover:underline" style={{ color: '#1F2937' }}>Back to login</Link>
      </p>
    </div>
  );
}
