import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "@/hooks/use-toast";  // Changed: Import standalone toast function
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateContent from "./pages/CreateContent";
import Settings from "./pages/Settings";
import GenerateHooks from "./pages/GenerateHooks";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import FreeDashboard from "./pages/FreeDashboard";
import ProDashboard from "./pages/ProDashboard";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import FreeCreateContent from "./pages/FreeCreateContent";
import StarterDashboard from "./pages/StarterDashboard";
import StarterGenerateHooks from "./pages/StarterGenerateHooks";
import StarterSavedHooks from "./pages/StarterSavedHooks";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StarterDashboardLayout } from "@/components/layouts/StarterDashboardLayout";
import ProCreateContent from "./pages/ProCreateContent";
import ProGenerateHooks from "./pages/ProGenerateHooks";
import ProSavedHooks from "./pages/ProSavedHooks";
import { ProDashboardLayout } from "@/components/layouts/ProDashboardLayout";
import ProCreateHooks from "./pages/ProCreateHooks";
import StarterGreenScreenify from "./pages/StarterGreenScreenify";

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
    // Separate useEffect for URL parameters to avoid hook dependency issues
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const paymentCancelled = urlParams.get('payment_cancelled');

    if (paymentSuccess) {
      toast({
        title: "Payment Successful",
        description: "Your subscription has been activated.",
      });
    } else if (paymentCancelled) {
      toast({
        title: "Payment Cancelled",
        description: "Please try again if you'd like to subscribe.",
        variant: "destructive",
      });
    }
  }, []);  // Empty dependency array since we don't use any external values

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
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-primary hover:text-primary/80"
              >
                Home
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-primary hover:text-primary/80"
              >
                Pricing
              </button>
              <button 
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-primary hover:text-primary/80"
              >
                FAQ
              </button>
            </div>
            <div className="flex items-center">
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
                <StarterDashboardLayout>
                  <StarterDashboard />
                </StarterDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/starter/create"
            element={
              <ProtectedRoute>
                <StarterDashboardLayout>
                  <CreateContent />
                </StarterDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/starter/hooks"
            element={
              <ProtectedRoute>
                <StarterDashboardLayout>
                  <StarterGenerateHooks />
                </StarterDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/starter/saved-hooks"
            element={
              <ProtectedRoute>
                <StarterDashboardLayout>
                  <StarterSavedHooks />
                </StarterDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/starter/green-screenify"
            element={
              <ProtectedRoute>
                <StarterDashboardLayout>
                  <StarterGreenScreenify />
                </StarterDashboardLayout>
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
                <ProDashboardLayout>
                  <ProDashboard />
                </ProDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pro/create"
            element={
              <ProtectedRoute>
                <ProDashboardLayout>
                  <ProCreateContent />
                </ProDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pro/hooks"
            element={
              <ProtectedRoute>
                <ProDashboardLayout>
                  <ProGenerateHooks />
                </ProDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pro/hooks/create"
            element={
              <ProtectedRoute>
                <ProDashboardLayout>
                  <ProCreateHooks />
                </ProDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pro/saved-hooks"
            element={
              <ProtectedRoute>
                <ProDashboardLayout>
                  <ProSavedHooks />
                </ProDashboardLayout>
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
