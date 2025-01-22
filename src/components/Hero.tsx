import { StatsSection } from "@/components/StatsSection";
import { FeatureGrid } from "@/components/FeatureGrid";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white pt-16">
      <div className="w-full px-4 max-w-[1920px] mx-auto">
        {/* Hero content with max width */}
        <div className="text-center max-w-3xl mx-auto animate-fade-up mb-12 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Create Stunning AI Videos for Social Media
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your content with AI-powered video effects and hooks that capture attention and drive engagement.
          </p>
        </div>
        
        {/* Feature Grid */}
        <FeatureGrid />
        
        {/* Stats Section without max width constraint */}
        <StatsSection />
      </div>
    </div>
  );
};