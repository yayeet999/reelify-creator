import { useNavigate } from "react-router-dom";
import { User, Settings, FilePlus, Code, Zap } from "lucide-react";
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
    description: "Access advanced content creation features",
    icon: <FilePlus className="w-5 h-5" />,
    path: "/create",
  },
  {
    title: "Generate Custom Hooks",
    description: "Create custom hooks for your content",
    icon: <Code className="w-5 h-5" />,
    path: "/hooks",
  },
];

const ProDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpgradeToEnterprise = () => {
    toast({
      title: "Interested in Enterprise?",
      description: "Contact our sales team for custom solutions!",
    });
    navigate("/pricing");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-purple-50 rounded-lg p-6 shadow-sm border border-purple-200">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-purple-900">
              Dashboard <span className="text-2xl text-purple-600">(Pro Plan)</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome to your pro dashboard. Unlock enterprise features for even more capabilities!
            </p>
            <Button 
              onClick={handleUpgradeToEnterprise}
              className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Enterprise
            </Button>
          </div>
        </div>

        {/* Quick Start Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        {/* Pro Features Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold mb-2">Pro Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Up to 200 content generations per month</li>
              <li>• Maximum video length: 3 minutes</li>
              <li>• Advanced effects and features</li>
              <li>• Priority support</li>
            </ul>
          </div>
          <div className="bg-indigo-50/50 rounded-lg p-6 shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold mb-2">Enterprise Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Unlimited content generations</li>
              <li>• Custom video length limits</li>
              <li>• Custom effects and features</li>
              <li>• Dedicated support team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;