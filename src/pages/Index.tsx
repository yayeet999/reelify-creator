import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <FAQ />
    </div>
  );
};

export default Index;