import { useNavigate } from "react-router-dom";
import { Code, FilePlus, Video, Film } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { subscriptionTier } = useAuth();

  const getQuickStartOptions = () => {
    const baseOptions = [
      {
        title: "Create Content",
        description: "Start creating your first piece of content",
        icon: <FilePlus className="w-5 h-5" />,
        path: "/dashboard/create",
      },
    ];

    const starterOptions = [
      {
        title: "Generate Hooks",
        description: "Create custom React hooks for your projects",
        icon: <Code className="w-5 h-5" />,
        path: "/dashboard/hooks",
      },
      {
        title: "Green Screenify",
        description: "Create videos with custom backgrounds",
        icon: <Video className="w-5 h-5" />,
        path: "/dashboard/green-screenify",
      },
      {
        title: "Video Editor",
        description: "Edit and customize videos",
        icon: <Film className="w-5 h-5" />,
        path: "/dashboard/video-editor",
      },
    ];

    return subscriptionTier === "free" ? baseOptions : [...baseOptions, ...starterOptions];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Dashboard
              {subscriptionTier !== "free" && (
                <span className="text-2xl text-primary ml-2">
                  ({subscriptionTier})
                </span>
              )}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome! Here's what you can do
            </p>
          </div>
        </div>

        {/* Quick Start Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getQuickStartOptions().map((option) => (
            <QuickStartCard
              key={option.title}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => navigate(option.path)}
            />
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-accent-purple/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Quick Tips</h3>
            <p className="text-sm text-muted-foreground">
              Explore the dashboard to access all features available in your subscription tier.
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
      </div>
    </div>
  );
};

export default Dashboard;