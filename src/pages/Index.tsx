import { useNavigate } from "react-router-dom";
import { User, Code, FilePlus } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { FAQ } from "@/components/FAQ";

const quickStartOptions = [
  {
    title: "Complete Your Profile",
    description: "Set up your personal information and preferences",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
  {
    title: "Generate Hooks",
    description: "Create reusable React hooks for your projects",
    icon: <Code className="w-5 h-5" />,
    path: "/starter/hooks",
  },
  {
    title: "Create New Content",
    description: "Start creating your first piece of content",
    icon: <FilePlus className="w-5 h-5" />,
    path: "/create",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Dashboard <span className="text-2xl text-primary">(Starter Plan)</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome back! Here's what you can do
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
          <div className="bg-accent-purple/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Quick Tips</h3>
            <p className="text-sm text-muted-foreground">
              Explore the dashboard to access all features and customize your experience.
            </p>
          </div>
          <div className="bg-accent-pink/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check out our documentation or contact support for assistance.
            </p>
          </div>
          <div className="bg-accent-green/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">What's New</h3>
            <p className="text-sm text-muted-foreground">
              Stay updated with the latest features and improvements.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  );
};

export default Index;