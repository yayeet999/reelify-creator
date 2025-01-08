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

const EnterpriseDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-amber-50 rounded-lg p-6 shadow-sm border border-amber-200">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-amber-900">
              Enterprise Dashboard
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome to your enterprise tier dashboard
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
          <div className="bg-amber-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Enterprise Features</h3>
            <p className="text-sm text-muted-foreground">
              Access all premium features and dedicated support.
            </p>
          </div>
          <div className="bg-amber-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
            <p className="text-sm text-muted-foreground">
              24/7 access to our dedicated support team.
            </p>
          </div>
          <div className="bg-amber-50/50 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Custom Solutions</h3>
            <p className="text-sm text-muted-foreground">
              Get customized solutions for your enterprise needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;