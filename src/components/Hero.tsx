import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { StatsSection } from "@/components/StatsSection";
import { FeatureGrid } from "@/components/FeatureGrid";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-accent-purple/50 to-white pt-16">
      {/* Add navigation bar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <img 
                src="/logonotreel.png" 
                alt="NotReel Logo" 
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-primary">
                notreel.ai
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full px-4 max-w-[1920px] mx-auto">
        {/* Hero content with max width */}
        <div className="text-center max-w-3xl mx-auto animate-fade-up mb-12 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Create Stunning AI Videos for Social Media
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your content with AI-powered video effects and hooks that capture attention and drive engagement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="group">
              Get Started Free
              <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
        
        {/* Feature Grid */}
        <FeatureGrid />
        
        {/* Stats Section without max width constraint */}
        <StatsSection />
      </div>
    </div>
  );
};