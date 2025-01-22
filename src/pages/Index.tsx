import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { PublicHeader } from "@/components/PublicHeader";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <Hero />
      <Features />
      <FAQ />
    </div>
  );
};

export default Index;