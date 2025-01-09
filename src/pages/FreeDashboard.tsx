import { useNavigate } from "react-router-dom";
import { User, Settings, FilePlus, Code, Crown } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const quickStartOptions = [
  {
    title: "Complete Your Profile",
    description: "Set up your personal information and preferences",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
  {
    title: "Create New Content",
    description: "Start creating your first piece of content (Limited features)",
    icon: <FilePlus className="w-5 h-5" />,
    path: "/create",
  },
];

const FreeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: "Ready to upgrade?",
      description: "Let's get you started with more features!",
    });
    navigate("/pricing");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Free Dashboard
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome to your free tier dashboard. Upgrade to unlock more features!
            </p>
            <Button 
              onClick={handleUpgrade}
              className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* Quick Start Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {quickStartOptions.map((option) => (
            <QuickStartCard
              key={option.title}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => navigate(option.path)}
            />
          ))}
        </div>

        {/* Feature Limitations Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-orange-50/50 rounded-lg p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-2">Free Tier Limits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Up to 10 content generations per month</li>
              <li>• Maximum video length: 30 seconds</li>
              <li>• Basic effects only</li>
              <li>• Community support</li>
            </ul>
          </div>
          <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold mb-2">Upgrade Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 50+ content generations per month</li>
              <li>• Longer video support</li>
              <li>• Advanced effects and features</li>
              <li>• Priority support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeDashboard;