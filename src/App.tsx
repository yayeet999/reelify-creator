import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import CreateContent from "@/pages/CreateContent";
import FreeCreateContent from "@/pages/FreeCreateContent";
import FreeDashboard from "@/pages/FreeDashboard";
import ProDashboard from "@/pages/ProDashboard";
import EnterpriseDashboard from "@/pages/EnterpriseDashboard";
import GenerateHooks from "@/pages/GenerateHooks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Free Plan Routes */}
        <Route path="/free" element={<DashboardLayout />}>
          <Route path="dashboard" element={<ProtectedRoute><FreeDashboard /></ProtectedRoute>} />
          <Route path="create" element={<ProtectedRoute><FreeCreateContent /></ProtectedRoute>} />
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="create" element={<ProtectedRoute><CreateContent /></ProtectedRoute>} />
          <Route path="hooks" element={<ProtectedRoute><GenerateHooks /></ProtectedRoute>} />
          <Route path="pro/dashboard" element={<ProtectedRoute><ProDashboard /></ProtectedRoute>} />
          <Route path="enterprise/dashboard" element={<ProtectedRoute><EnterpriseDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;