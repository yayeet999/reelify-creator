import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
