import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import StarterDashboard from "./pages/StarterDashboard";
import { StarterDashboardLayout } from "./components/layouts/StarterDashboardLayout";
import StarterGenerateHooks from "./pages/StarterGenerateHooks";
import StarterGreenScreenify from "./pages/StarterGreenScreenify";
import StarterSavedHooks from "./pages/StarterSavedHooks";
import StarterCreateContent from "./pages/StarterCreateContent";
import StarterVideoEditor from "./pages/StarterVideoEditor";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<StarterDashboardLayout />}>
            <Route path="/starter-dashboard" element={<StarterDashboard />} />
            <Route path="/starter/create" element={<StarterCreateContent />} />
            <Route path="/starter/hooks" element={<StarterGenerateHooks />} />
            <Route path="/starter/saved-hooks" element={<StarterSavedHooks />} />
            <Route path="/starter/green-screenify" element={<StarterGreenScreenify />} />
            <Route path="/starter/video-editor" element={<StarterVideoEditor />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;