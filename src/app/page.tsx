import Banner from '@/components/Banner';
import CTASection from '@/components/CTASection';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import IntelligentTools from '@/components/IntelligentTools';
import Navbar from '@/components/Navbar';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090C] text-gray-100 flex flex-col selection:bg-[#FFE600]/30 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Banner />
        <Features />
        <HowItWorks />
        <IntelligentTools />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}