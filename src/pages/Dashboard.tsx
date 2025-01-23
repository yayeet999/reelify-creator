import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSubscriptionTier } from "@/hooks/useSubscriptionTier";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { ResourceCenter } from "@/components/dashboard/ResourceCenter";

const Dashboard = () => {
  const navigate = useNavigate();
  const { subscriptionTier } = useAuth();
  const { isSubscriptionLoading } = useSubscriptionTier();

  if (isSubscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Dashboard
              {subscriptionTier !== "free" && (
                <span className="text-2xl text-primary ml-2 capitalize">
                  ({subscriptionTier})
                </span>
              )}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome to your dashboard! Here's an overview of your activity
            </p>
            {subscriptionTier === "free" && (
              <Alert className="mt-4 bg-primary/5 border-primary/10">
                <AlertTitle className="text-primary">Free Plan</AlertTitle>
                <AlertDescription>
                  You're currently on the free plan. Upgrade to access premium features.
                  <Button
                    variant="link"
                    className="ml-2 text-primary"
                    onClick={() => navigate("/pricing")}
                  >
                    View Plans
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <MetricsOverview />
        </div>

        {/* Resource Center */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <ResourceCenter />
        </div>

        {subscriptionTier === "free" && (
          <Alert>
            <AlertDescription>
              Upgrade your subscription to access more features and capabilities.
              <Button
                variant="link"
                className="ml-2 text-primary"
                onClick={() => navigate("/pricing")}
              >
                View Plans
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Dashboard;