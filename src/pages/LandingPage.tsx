import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  Features,
  HowItWorks,
  DashboardPreview,
  FAQ,
  CTA,
} from "@/components/landing";

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
