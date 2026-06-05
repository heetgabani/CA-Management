import { Suspense } from 'react';
import VerifyOtpContent from './VerifyOtpContent';

export default function VerifyOtpPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin w-6 h-6 rounded-full border-2 border-[#111827] border-t-transparent" /></div>}><VerifyOtpContent /></Suspense>;
}
