import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppRoutes } from "@/routes/AppRoutes";

const queryClient = new QueryClient();

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (location.hash === '#pricing') {
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              notreel.ai
            </Link>
            <Link 
              to={isAuthenticated ? "/dashboard" : "/auth"} 
              className="text-primary hover:text-primary/80"
            >
              {isAuthenticated ? "Go to Dashboard" : "Sign In"}
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Hero />
        <Features />
        <div id="pricing" className="scroll-mt-20">
          <Pricing />
        </div>
        <div id="faq" className="scroll-mt-20">
          <FAQ />
        </div>
      </main>
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <button 
                onClick={scrollToTop}
                className="text-primary hover:text-primary/80"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-primary hover:text-primary/80"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-primary hover:text-primary/80"
              >
                FAQ
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                to="/auth" 
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </Link>
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} notreel.ai. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  // Initialize session restoration
  useEffect(() => {
    const savedPath = sessionStorage.getItem('redirect_path');
    if (savedPath) {
      sessionStorage.removeItem('redirect_path');
      window.history.replaceState({}, '', savedPath);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
