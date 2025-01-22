import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { PublicNavbar } from "@/components/PublicNavbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <Hero />
      <Features />
      <FAQ />
    </div>
  );
};

export default Index;