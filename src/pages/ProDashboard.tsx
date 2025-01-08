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

const ProDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-purple-50 rounded-lg p-6 shadow-sm border border-purple-200">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-purple-900">
              Pro Dashboard
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome to your pro tier dashboard
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
          <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Pro Features</h3>
            <p className="text-sm text-muted-foreground">
              Access advanced features and premium content.
            </p>
          </div>
          <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Priority Support</h3>
            <p className="text-sm text-muted-foreground">
              Get priority access to our support team.
            </p>
          </div>
          <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Enterprise Features</h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to enterprise for maximum capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;