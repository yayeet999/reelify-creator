import { useSubscriptionTier } from "@/hooks/useSubscriptionTier";
import type { SubscriptionTier } from "@/types/subscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredTier: SubscriptionTier;
  fallback?: React.ReactNode;
}

export function SubscriptionGuard({ 
  children, 
  requiredTier, 
  fallback 
}: SubscriptionGuardProps) {
  const { hasAccess, currentTier } = useSubscriptionTier();
  const { isSubscriptionLoading } = useAuth();
  const navigate = useNavigate();

  if (isSubscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAccess(requiredTier)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Alert className="max-w-xl mx-auto my-8">
      <AlertTitle className="text-lg font-semibold">
        Upgrade Required
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">
          This feature requires a {requiredTier} subscription. You are currently on the {currentTier} tier.
        </p>
        <Button 
          onClick={() => navigate("/pricing")} 
          variant="default"
          className="bg-primary hover:bg-primary/90"
        >
          Upgrade Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}