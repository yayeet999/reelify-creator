import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import GenerateHooks from "@/pages/GenerateHooks";
import GreenScreenify from "@/pages/GreenScreenify";
import SavedHooks from "@/pages/SavedHooks";
import CreateContent from "@/pages/CreateContent";
import VideoEditor from "@/pages/VideoEditor";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { SubscriptionGuard } from "@/components/guards/SubscriptionGuard";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

export function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public routes - no AuthProvider */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected route - Settings */}
        <Route
          path="/settings"
          element={
            <AuthProvider>
              <AuthGuard>
                <Settings />
              </AuthGuard>
            </AuthProvider>
          }
        />

        {/* Protected routes - Dashboard and related pages */}
        <Route
          element={
            <AuthProvider>
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            </AuthProvider>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<CreateContent />} />
          <Route 
            path="/dashboard/hooks" 
            element={
              <SubscriptionGuard requiredTier="starter">
                <GenerateHooks />
              </SubscriptionGuard>
            } 
          />
          <Route 
            path="/dashboard/saved-hooks" 
            element={
              <SubscriptionGuard requiredTier="starter">
                <SavedHooks />
              </SubscriptionGuard>
            } 
          />
          <Route 
            path="/dashboard/green-screenify" 
            element={
              <SubscriptionGuard requiredTier="starter">
                <GreenScreenify />
              </SubscriptionGuard>
            } 
          />
          <Route 
            path="/dashboard/video-editor" 
            element={
              <SubscriptionGuard requiredTier="starter">
                <VideoEditor />
              </SubscriptionGuard>
            } 
          />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
} 