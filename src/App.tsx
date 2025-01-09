import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateContent from "./pages/CreateContent";
import Settings from "./pages/Settings";
import GenerateHooks from "./pages/GenerateHooks";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Pricing } from "./components/Pricing";
import FreeDashboard from "./pages/FreeDashboard";
import ProDashboard from "./pages/ProDashboard";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import FreeCreateContent from "./pages/FreeCreateContent";
import StarterDashboard from "./pages/StarterDashboard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

const queryClient = new QueryClient();

// Landing page component
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
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
      <Hero />
      <Features />
      <div id="pricing" className="scroll-mt-20">
        <Pricing />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Starter Plan Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StarterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/starter/create"
            element={
              <ProtectedRoute>
                <CreateContent />
              </ProtectedRoute>
            }
          />

          {/* Free Plan Routes */}
          <Route
            path="/free/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FreeDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/free/create"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FreeCreateContent />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Pro Plan Routes */}
          <Route
            path="/pro/dashboard"
            element={
              <ProtectedRoute>
                <ProDashboard />
              </ProtectedRoute>
            }
          />

          {/* Enterprise Plan Routes */}
          <Route
            path="/enterprise/dashboard"
            element={
              <ProtectedRoute>
                <EnterpriseDashboard />
              </ProtectedRoute>
            }
          />

          {/* Common Routes */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hooks"
            element={
              <ProtectedRoute>
                <GenerateHooks />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;