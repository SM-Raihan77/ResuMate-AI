import { Navbar, Footer } from "@/components/shared";
import {
  Banner,
  Features,
  HowItWorks,
  IntelligentTools,
  Testimonials,
  CTASection,
} from "@/components/features/landing";

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
