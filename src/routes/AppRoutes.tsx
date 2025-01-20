import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StarterDashboardLayout } from "@/components/layouts/StarterDashboardLayout";
import { ProDashboardLayout } from "@/components/layouts/ProDashboardLayout";
import CreateContent from "@/pages/CreateContent";
import Settings from "@/pages/Settings";
import GenerateHooks from "@/pages/GenerateHooks";
import FreeDashboard from "@/pages/FreeDashboard";
import ProDashboard from "@/pages/ProDashboard";
import EnterpriseDashboard from "@/pages/EnterpriseDashboard";
import FreeCreateContent from "@/pages/FreeCreateContent";
import StarterDashboard from "@/pages/StarterDashboard";
import StarterGenerateHooks from "@/pages/StarterGenerateHooks";
import StarterSavedHooks from "@/pages/StarterSavedHooks";
import StarterGreenScreenify from "@/pages/StarterGreenScreenify";
import ProCreateContent from "@/pages/ProCreateContent";
import ProGenerateHooks from "@/pages/ProGenerateHooks";
import ProSavedHooks from "@/pages/ProSavedHooks";
import ProCreateHooks from "@/pages/ProCreateHooks";

export const AppRoutes = () => {
  return (
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
        path="/starter/*"
        element={
          <ProtectedRoute>
            <StarterDashboardLayout>
              <Routes>
                <Route path="create" element={<CreateContent />} />
                <Route path="hooks" element={<StarterGenerateHooks />} />
                <Route path="saved-hooks" element={<StarterSavedHooks />} />
                <Route path="green-screenify" element={<StarterGreenScreenify />} />
              </Routes>
            </StarterDashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Free Plan Routes */}
      <Route
        path="/free/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<FreeDashboard />} />
                <Route path="create" element={<FreeCreateContent />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Pro Plan Routes */}
      <Route
        path="/pro/*"
        element={
          <ProtectedRoute>
            <ProDashboardLayout>
              <Routes>
                <Route path="dashboard" element={<ProDashboard />} />
                <Route path="create" element={<ProCreateContent />} />
                <Route path="hooks" element={<ProGenerateHooks />} />
                <Route path="hooks/create" element={<ProCreateHooks />} />
                <Route path="saved-hooks" element={<ProSavedHooks />} />
              </Routes>
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

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};