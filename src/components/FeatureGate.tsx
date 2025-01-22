import { useSubscriptionTier } from "@/hooks/useSubscriptionTier";
import type { SubscriptionTier } from "@/types/subscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureGateProps {
  children: React.ReactNode;
  requiredTier: SubscriptionTier;
  fallback?: React.ReactNode;
}

export function FeatureGate({ children, requiredTier, fallback }: FeatureGateProps) {
  const { hasAccess, currentTier } = useSubscriptionTier();
  const navigate = useNavigate();

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