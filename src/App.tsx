import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { StarterDashboardLayout } from "@/components/layouts/StarterDashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StarterDashboard from "./pages/StarterDashboard";
import StarterGenerateHooks from "./pages/StarterGenerateHooks";
import StarterSavedHooks from "./pages/StarterSavedHooks";
import StarterGreenScreenify from "./pages/StarterGreenScreenify";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <StarterDashboardLayout>
                    <StarterDashboard />
                  </StarterDashboardLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/hooks"
              element={
                <AuthGuard>
                  <StarterDashboardLayout>
                    <StarterGenerateHooks />
                  </StarterDashboardLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/saved-hooks"
              element={
                <AuthGuard>
                  <StarterDashboardLayout>
                    <StarterSavedHooks />
                  </StarterDashboardLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/green-screenify"
              element={
                <AuthGuard>
                  <StarterDashboardLayout>
                    <StarterGreenScreenify />
                  </StarterDashboardLayout>
                </AuthGuard>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;