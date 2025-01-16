import { useNavigate } from "react-router-dom";
import { Code, FileCode, GitBranch, Package } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { useSubscriptionGuard } from "@/hooks/use-subscription-guard";

const hookOptions = [
  {
    title: "Create Custom Hook",
    description: "Generate a new custom React hook with pro features",
    icon: <Code className="w-5 h-5" />,
    path: "/pro/hooks/create",
  },
  {
    title: "Pro Hook Templates",
    description: "Choose from premium pre-built hook templates",
    icon: <FileCode className="w-5 h-5" />,
    path: "/pro/hooks/templates",
  },
  {
    title: "Pro Hook Library",
    description: "Browse and manage your premium hook collection",
    icon: <Package className="w-5 h-5" />,
    path: "/pro/hooks/library",
  },
];

const ProGenerateHooks = () => {
  const navigate = useNavigate();
  const { isLoading } = useSubscriptionGuard("pro");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                Pro Generate Hooks
              </h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              Create and manage premium custom React hooks for your project
            </p>
          </div>
        </div>

        {/* Hook Options Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hookOptions.map((option) => (
            <QuickStartCard
              key={option.title}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => navigate(option.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProGenerateHooks;