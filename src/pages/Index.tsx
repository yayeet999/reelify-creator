import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { PublicHeader } from "@/components/PublicHeader";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <div className="pt-16"> {/* Add padding to account for fixed header */}
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
      </div>
    </div>
  );
};

export default Index;