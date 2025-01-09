import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FreeCreateContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: "Ready to upgrade?",
      description: "Let's get you started with more features!",
    });
    navigate("/#pricing");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Create Content <span className="text-2xl text-gray-600">(Free Plan)</span>
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Start creating amazing content with our free tier features.
              </p>
              <Button 
                onClick={handleUpgrade}
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Free Tier Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Basic text overlays</li>
                <li>• Standard video templates</li>
                <li>• 720p video quality</li>
                <li>• Up to 30-second videos</li>
              </ul>
            </div>

            <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold mb-2">Pro Features Available</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Advanced text animations</li>
                <li>• Premium templates</li>
                <li>• 4K video quality</li>
                <li>• Unlimited video length</li>
              </ul>
            </div>

            <div className="bg-blue-50/50 rounded-lg p-6 shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI-powered editing</li>
                <li>• Custom branding</li>
                <li>• Team collaboration</li>
                <li>• Analytics dashboard</li>
              </ul>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              Ready to create your first video? Upgrade to our Pro plan to unlock all features and start creating professional content today.
            </p>
            <Button 
              onClick={handleUpgrade}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreeCreateContent;