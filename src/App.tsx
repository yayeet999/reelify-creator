import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import GenerateHooks from "./pages/GenerateHooks";
import GreenScreenify from "./pages/GreenScreenify";
import SavedHooks from "./pages/SavedHooks";
import CreateContent from "./pages/CreateContent";
import VideoEditor from "./pages/VideoEditor";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/guards/AuthGuard";
import { SubscriptionGuard } from "./components/guards/SubscriptionGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes outside of AuthProvider */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes wrapped in AuthProvider */}
          <Route
            element={
              <AuthProvider>
                <Route
                  path="/settings"
                  element={
                    <AuthGuard>
                      <Settings />
                    </AuthGuard>
                  }
                />
                <Route
                  element={
                    <AuthGuard>
                      <DashboardLayout />
                    </AuthGuard>
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
              </AuthProvider>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;