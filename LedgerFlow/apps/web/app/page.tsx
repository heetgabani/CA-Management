import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import Problem from '@/components/Problem';
import Features from '@/components/Features';
import Showcase from '@/components/Showcase';
import Workflow from '@/components/Workflow';
import Solutions from '@/components/Solutions';
import Compliance from '@/components/Compliance';
import Security from '@/components/Security';
import AIPreview from '@/components/AIPreview';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <Problem />
      <Features />
      <Showcase />
      <Workflow />
      <Solutions />
      <Compliance />
      <Security />
      <AIPreview />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
