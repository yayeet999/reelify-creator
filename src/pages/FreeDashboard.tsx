import { useNavigate } from "react-router-dom";
import { User, Settings, FilePlus, Code } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";

const quickStartOptions = [
  {
    title: "Complete Your Profile",
    description: "Set up your personal information and preferences",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
  {
    title: "Configure Settings",
    description: "Customize your application settings",
    icon: <Settings className="w-5 h-5" />,
    path: "/settings",
  },
  {
    title: "Create New Content",
    description: "Start creating your first piece of content",
    icon: <FilePlus className="w-5 h-5" />,
    path: "/create",
  },
  {
    title: "Generate Custom Hooks",
    description: "Create reusable React hooks for your projects",
    icon: <Code className="w-5 h-5" />,
    path: "/hooks",
  },
];

const FreeDashboard = () => {
  const navigate = useNavigate();

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
              Welcome to your free tier dashboard
            </p>
          </div>
        </div>

        {/* Quick Start Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Additional Stats or Info Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Free Tier Features</h3>
            <p className="text-sm text-muted-foreground">
              Explore basic features and consider upgrading for more capabilities.
            </p>
          </div>
          <div className="bg-gray-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check out our documentation or contact support for assistance.
            </p>
          </div>
          <div className="bg-gray-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Upgrade Now</h3>
            <p className="text-sm text-muted-foreground">
              Get access to more features with our paid plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeDashboard;