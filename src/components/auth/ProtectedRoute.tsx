import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userProfile, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to appropriate dashboard based on subscription tier
  if (userProfile) {
    const currentPath = window.location.pathname;
    const tierPaths = {
      free: '/free/dashboard',
      starter: '/dashboard',
      pro: '/pro/dashboard',
      enterprise: '/enterprise/dashboard'
    };

    const userTier = userProfile.subscription_tier;
    const correctPath = tierPaths[userTier];
    
    if (Object.values(tierPaths).includes(currentPath) && currentPath !== correctPath) {
      return <Navigate to={correctPath} replace />;
    }

    return <>{children}</>;
  }

  return <>{children}</>;
};