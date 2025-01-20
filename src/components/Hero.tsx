import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { StatsSection } from "@/components/StatsSection";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-accent-purple/50 to-white pt-16">
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
            {!isAuthenticated && (
              <Link to="/auth">
                <Button size="lg" className="group">
                  Get Started Free
                  <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
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